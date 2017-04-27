import {GraphAbstract} from "./graphabstract";
import {Plane} from "../../plane/plane";
import {NodeAbstract} from "./nodes/nodeelementabstract";
import {BasicConnection} from "../data/databasicconnection";
import {BasicEntity} from "../data/databasicentity";


export enum AUTOGRAPH_EDGETYPES {
    BY_DATA,
    BY_FUNCTION,
    BY_ONE_HOP
}

export class AutoGraph extends GraphAbstract {

    protected edgesCreatedForSameNodeTypePairs = {};

    protected mappingStructure = {
        nodes: [
            // {
            //     data: DocumentDataEntity,
            //     node: NodeDoc
            // },
        ],
        edges: [
            // {
            //     type: AUTOGRAPH_EDGETYPES.BY_DATA,
            //     dataConnection: AuthorAffiliationConnection,
            //     edge: EdgeMovingAuthorAffiliation
            // },
            // {
            //     type: AUTOGRAPH_EDGETYPES.BY_FUNCTION,
            //     fct: this.getAffiliationOfAuthorsByDocNode.bind(this),
            //     sourceNodeType: NodeDoc,
            //     edge: EdgeBasic
            // }
        ]
    };

    constructor(protected plane:Plane) {
        super(plane);
    }


    public init() {
        super.init();
        console.log(" ----------- " + this.mappingStructure.edges[0].type + " -----------------------");
        this.mappingStructure.nodes.forEach((nodeMapping) => {
            let dataList = nodeMapping.data.getDataList();
            dataList.forEach((dataEntity) => {
                /*
                 Be sure that a node is only created once!
                 */
                let node:NodeAbstract;
                dataEntity.getRegisteredGraphElements().forEach((n:NodeAbstract) => {
                    if (!node && n.getPlane().getGraph() === this) {
                        node = n;
                    }
                });
                if (!node) {
                    node = new nodeMapping.node(0, 0, dataEntity, this.plane, {});
                    this.graphElements.push(node);
                    this.plane.getGraphScene().addObject(node);
                }
            });
        });


        this.graphElements.forEach((srcNode:NodeAbstract) => {

            let connectionsUsed = [];

            srcNode.getDataEntity().getConnections().forEach((connection:BasicConnection) => {

                let connectedEntity = connection.getEntities().src.constructor !== srcNode.getDataEntity().constructor ?
                    connection.getEntities().src : connection.getEntities().dst;

                if (connection.getAlreadyPaintedFlag(this.plane.getId()))
                    return;
                connection.setAlreadyPaintedFlag(this.plane.getId());

                this.mappingStructure.edges.forEach((edgeMapping) => {

                    if (edgeMapping.type === AUTOGRAPH_EDGETYPES.BY_DATA) {
                        let dstNode = this.getNodeByDataObject(connectedEntity);
                        if (connection.constructor === edgeMapping.dataConnection) {
                            let edge = new edgeMapping.edge(srcNode, dstNode, this.plane);
                            srcNode.addEdge(edge);
                            dstNode.addEdge(edge);
                            this.edges.push(edge);
                            this.plane.getGraphScene().addObject(edge);
                        }
                    } else if (edgeMapping.type === AUTOGRAPH_EDGETYPES.BY_FUNCTION ||
                        edgeMapping.type === AUTOGRAPH_EDGETYPES.BY_ONE_HOP) {


                        if (edgeMapping.sourceNodeType !== srcNode.constructor)
                            return;
                        let nodesToConnect:NodeAbstract[];
                        if (edgeMapping.type === AUTOGRAPH_EDGETYPES.BY_FUNCTION)
                            nodesToConnect = edgeMapping.fct(srcNode);
                        else if (edgeMapping.type === AUTOGRAPH_EDGETYPES.BY_ONE_HOP)
                            nodesToConnect = this.getSameTypeNodesOverAHop(srcNode, edgeMapping.hopDataEntityType);

                        nodesToConnect.forEach((dstNode:NodeAbstract) => {
                            let edge = new edgeMapping.edge(srcNode, dstNode, this.plane);
                            srcNode.addEdge(edge);
                            dstNode.addEdge(edge);
                            this.edges.push(edge);
                            this.plane.getGraphScene().addObject(edge);
                        });
                    }
                });
            });
        });
        this.setLayout();
    }

    protected getNodeByDataObject(data:BasicEntity):NodeAbstract {
        let foundNode:NodeAbstract = null;
        this.graphElements.forEach((n:NodeAbstract) => {
            if (foundNode)
                return;

            if (n.getDataEntity().constructor !== data.constructor)
                return;
            if (n.getDataEntity().getId() === data.getId())
                foundNode = n;
        });

        return foundNode;
    }

    protected getSameTypeNodesOverAHop(srcNode:NodeAbstract, hopNodeDataEntityType) {
        let finalConnectedNodes:NodeAbstract[] = [];

        srcNode.getDataEntity().getConnections().forEach((firstConnection:BasicConnection) => {

            let connectedHopEntity:BasicEntity;
            if (firstConnection.getEntities().src.constructor === srcNode.getDataEntity().constructor)
                connectedHopEntity = firstConnection.getEntities().dst;
            else if (firstConnection.getEntities().dst.constructor === srcNode.getDataEntity().constructor)
                connectedHopEntity = firstConnection.getEntities().src;
            else
                return;

            if (connectedHopEntity.constructor !== hopNodeDataEntityType)
                return;


            connectedHopEntity.getConnections().forEach((secondConnection:BasicConnection) => {

                let connectedTwoStepSameTypeEntity:BasicEntity;
                if (secondConnection.getEntities().src.constructor === srcNode.getDataEntity().constructor)
                    connectedTwoStepSameTypeEntity = secondConnection.getEntities().src;
                else if (secondConnection.getEntities().dst.constructor === srcNode.getDataEntity().constructor)
                    connectedTwoStepSameTypeEntity = secondConnection.getEntities().dst;
                else
                    return;


                if (connectedTwoStepSameTypeEntity.getId() === srcNode.getDataEntity().getId())
                    return;

                connectedTwoStepSameTypeEntity.getRegisteredGraphElements().forEach((n:NodeAbstract) => {
                    if (n.getPlane().getId() !== this.plane.getId())
                        return;

                    let minId = Math.min(srcNode.getDataEntity().getId(), connectedTwoStepSameTypeEntity.getId());
                    let maxId = Math.max(srcNode.getDataEntity().getId(), connectedTwoStepSameTypeEntity.getId());
                    if (typeof this.edgesCreatedForSameNodeTypePairs[minId] === "undefined")
                        this.edgesCreatedForSameNodeTypePairs[minId] = [];

                    if (typeof this.edgesCreatedForSameNodeTypePairs[minId][maxId] !== "undefined") {
                        this.edgesCreatedForSameNodeTypePairs[minId][maxId]++;
                        return;
                    }
                    this.edgesCreatedForSameNodeTypePairs[minId][maxId] = 1;


                    finalConnectedNodes.push(n);
                });
            })
        });
        return finalConnectedNodes;
    }


    private setLayout() {
        this.layout = new this.layoutClass(this.plane, this.graphElements, this.edges);
        this.layout.setInitPositions(() => {
            this.layout.calculateLayout(function () {
                console.log("Finished calculating layout " + this.graphElements.length + " nodes, " + this.edges.length + " edges");
                this.plane.getGraphScene().render();
                this.addEventListeners();
            }.bind(this));
        });
    }
}