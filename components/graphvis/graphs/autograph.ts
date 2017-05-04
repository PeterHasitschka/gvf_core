import {GraphAbstract} from "./graphabstract";
import {Plane} from "../../plane/plane";
import {NodeAbstract} from "./nodes/nodeelementabstract";
import {BasicConnection} from "../data/databasicconnection";
import {BasicEntity} from "../data/databasicentity";
import {EdgeAbstract} from "./edges/edgeelementabstract";


export enum AUTOGRAPH_EDGETYPES {
    BY_DATA,
    BY_FUNCTION,
    BY_ONE_HOP
}

export class AutoGraph extends GraphAbstract {

    /**
     * Holding a matrix of uniqueIds of Nodes and how often the algorithm wanted to create an edge between them.
     * Used for preventing creating the same edge multiple times and setting weights
     */
    protected connectionsWantedToCreateByNodePair = {};
    protected applyWeights = false;
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

            srcNode.getDataEntity().getConnections().forEach((connection:BasicConnection) => {

                let connectedEntity = connection.getEntities().src.constructor !== srcNode.getDataEntity().constructor ?
                    connection.getEntities().src : connection.getEntities().dst;


                this.mappingStructure.edges.forEach((edgeMapping) => {

                    if (edgeMapping.type === AUTOGRAPH_EDGETYPES.BY_DATA) {
                        let dstNode = this.getNodeByDataObject(connectedEntity);
                        if (connection.constructor === edgeMapping.dataConnection) {

                            if (this.registerAndCheckExistingRequestedEdge(srcNode, dstNode))
                                return false;

                            let edge = new edgeMapping.edge(srcNode, dstNode, this.plane);
                            this.setEdgeForRegisteredNodePairs(edge);

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
                            this.setEdgeForRegisteredNodePairs(edge);
                            srcNode.addEdge(edge);
                            dstNode.addEdge(edge);
                            this.edges.push(edge);
                            this.plane.getGraphScene().addObject(edge);
                        });
                    }
                });
            });
        });

        if (this.applyWeights)
            this.setEdgeAndNodeWeights();
        this.setLayout();

        this.connectionsWantedToCreateByNodePair = null;
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

                    if (this.registerAndCheckExistingRequestedEdge(srcNode, n))
                        return;
                    finalConnectedNodes.push(n);
                });
            })
        });
        return finalConnectedNodes;
    }


    /**
     * Registers if connection between two nodes was requested.
     * @param node1 {NodeAbstract}
     * @param node2 {NodeAbstract}
     * @return TRUE if already registered yet, FALSE if not registered
     */
    registerAndCheckExistingRequestedEdge(node1:NodeAbstract, node2:NodeAbstract) {
        let id1 = node1.getUniqueId();
        let id2 = node2.getUniqueId();
        let minId = Math.min(id1, id2);
        let maxId = Math.max(id1, id2);
        if (typeof this.connectionsWantedToCreateByNodePair[minId] === "undefined")
            this.connectionsWantedToCreateByNodePair[minId] = [];

        if (typeof this.connectionsWantedToCreateByNodePair[minId][maxId] !== "undefined") {
            this.connectionsWantedToCreateByNodePair[minId][maxId]['val']++;
            return true;
        }
        this.connectionsWantedToCreateByNodePair[minId][maxId] = {
            val: 1,
            edge: null
        };
        this.connectionsWantedToCreateByNodePair[minId][maxId]['val'] = 1;
        return false;
    }

    setEdgeForRegisteredNodePairs(edge:EdgeAbstract) {
        let id1 = edge.getSourceNode().getUniqueId();
        let id2 = edge.getDestNode().getUniqueId();
        let minId = Math.min(id1, id2);
        let maxId = Math.max(id1, id2);
        this.connectionsWantedToCreateByNodePair[minId][maxId]['edge'] = edge;
    }

    protected setEdgeAndNodeWeights() {
        // console.log(this.connectionsWantedToCreateByNodePair);

        let min = null;
        let max = null;

        // Normalize
        for (var i in this.connectionsWantedToCreateByNodePair) {
            for (var j in this.connectionsWantedToCreateByNodePair[i]) {
                let amount = this.connectionsWantedToCreateByNodePair[i][j]['val'];
                if (min === null)
                    min = amount;
                if (max === null)
                    max = amount;
                min = Math.min(min, amount);
                max = Math.max(max, amount);
            }
        }
        for (var i in this.connectionsWantedToCreateByNodePair) {
            for (var j in this.connectionsWantedToCreateByNodePair[i]) {
                let amount = this.connectionsWantedToCreateByNodePair[i][j]['val'];
                let weight = (amount - min) / (max - min);
                let edge = <EdgeAbstract>this.connectionsWantedToCreateByNodePair[i][j]['edge'];
                edge.setWeight(weight);
                edge.getSourceNode().setWeight(edge.getSourceNode().getWeight() + weight);
                edge.getDestNode().setWeight(edge.getDestNode().getWeight() + weight);

            }
        }
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