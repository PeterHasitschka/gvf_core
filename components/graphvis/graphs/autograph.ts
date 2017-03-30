import {GraphAbstract} from "./graphabstract";
import {Plane} from "../../plane/plane";
import {NodeAbstract} from "./nodes/nodeelementabstract";
import {BasicConnection} from "../data/databasicconnection";
import {BasicEntity} from "../data/databasicentity";
export class AutoGraph extends GraphAbstract {

    protected mappingStructure = {
        nodes: [
        ],
        edges: [
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


        this.graphElements.forEach((node:NodeAbstract) => {
            node.getDataEntity().getConnections().forEach((connection:BasicConnection) => {

                let srcData = connection.getEntities().src;
                let dstData = connection.getEntities().dst;

                if (srcData !== node.getDataEntity())
                    return;

                let srcNode = node;
                let dstNode = this.getNodeByDataObject(dstData);

                this.mappingStructure.edges.forEach((edgeMapping) => {
                    if (connection.constructor === edgeMapping.dataConnection) {
                        let edge = new edgeMapping.edge(srcNode, dstNode, this.plane);
                        srcNode.addEdge(edge);
                        dstNode.addEdge(edge);
                        this.edges.push(edge);
                        this.plane.getGraphScene().addObject(edge);
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
                console.log("Finished calculating layout");
                this.plane.getGraphScene().render();
                this.addEventListeners();
            }.bind(this));
        });
    }
}