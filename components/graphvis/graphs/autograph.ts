import {GraphAbstract} from "./graphabstract";
import {Plane} from "../../plane/plane";
import {NodeAbstract} from "./nodes/nodeelementabstract";
import {BasicConnection} from "../data/databasicconnection";
import {BasicEntity} from "../data/databasicentity";


export enum AUTOGRAPH_EDGETYPES {
    BY_DATA,
    BY_FUNCTION
}

export class AutoGraph extends GraphAbstract {

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
                    } else if (edgeMapping.type === AUTOGRAPH_EDGETYPES.BY_FUNCTION) {


                        if (edgeMapping.sourceNodeType !== srcNode.constructor)
                            return;

                        let nodesToConnect:NodeAbstract[] = edgeMapping.fct(srcNode);


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