import {GraphAbstract} from "./graphabstract";
import {Plane} from "../../plane/plane";
import {NodeAbstract} from "./nodes/nodeelementabstract";
import {BasicConnection} from "../data/databasicconnection";
import {BasicEntity} from "../data/databasicentity";
import {ElementAbstract} from "./graphelementabstract";
import {EdgeAbstract} from "./edges/edgeelementabstract";
import {NodepathAbstract} from "./nodepath/nodepathabstract";


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
    protected applyCalculatedWeights = false;
    protected applyOfflineWeightsByData = false;
    protected thinOut = true;
    protected thinOutThreshold = 0.0;
    protected nodeWeightByUniqueEdges = true;


    protected mappingStructure = {
        nodes: [
            // {
            //     data: DocumentDataEntity,
            //     node: NodeDoc
            //     filter: someFct
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
        ],
        paths: []
    };


    constructor(protected plane:Plane) {
        super(plane);
    }


    public init() {
        super.init();
        this.addGraphElements(null, true);

    }

    public addGraphElements(explicitList = null, setLayout = false) {


        this.mappingStructure.nodes.forEach((nodeMapping) => {

            // Function can be defined in the mapping to e.g. only show nodes from a specific server call
            let filterFct = typeof nodeMapping["filter"] !== "undefined" && nodeMapping["filter"] ? nodeMapping["filter"] : null;
            let dataList;
            if (!explicitList)
                dataList = nodeMapping.data.getDataList();
            else {
                dataList = [];
                for (let explKey in explicitList) {
                    let e = explicitList[explKey];
                    if (e instanceof nodeMapping.data)
                        dataList.push(e);
                }
            }


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

                    if (filterFct && !filterFct(dataEntity))
                        return;

                    node = new nodeMapping.node(0, 0, dataEntity, this.plane, {});

                    if (this.applyOfflineWeightsByData && dataEntity.getData("weight")) {
                        node.setWeight(dataEntity.getData("weight"));
                    }
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

                            let weight = false;
                            if (!this.applyCalculatedWeights && this.applyOfflineWeightsByData && connection.getData("weight"))
                                weight = connection.getData("weight");

                            this.registerAndCheckExistingRequestedEdge(srcNode, dstNode, edgeMapping.edge,
                                weight, connection);
                        }
                    } else if (edgeMapping.type === AUTOGRAPH_EDGETYPES.BY_FUNCTION ||
                        edgeMapping.type === AUTOGRAPH_EDGETYPES.BY_ONE_HOP) {
                        if (edgeMapping.sourceNodeType !== srcNode.constructor)
                            return;
                        let nodesToConnect:NodeAbstract[];
                        if (edgeMapping.type === AUTOGRAPH_EDGETYPES.BY_FUNCTION) {
                            nodesToConnect = edgeMapping.fct(srcNode);
                            nodesToConnect.forEach((n:NodeAbstract) => {
                                this.registerAndCheckExistingRequestedEdge(srcNode, n, edgeMapping.edge, false, connection)
                            });
                        }
                        else if (edgeMapping.type === AUTOGRAPH_EDGETYPES.BY_ONE_HOP)
                            this.registerConnectionsForSameTypeNodesOverAHop(srcNode, edgeMapping.hopDataEntityType, edgeMapping.edge);
                    }
                });
            });
        });

        if (this.applyCalculatedWeights)
            this.setEdgeAndNodeWeightsAndCreateEdges();
        else
            this.createRegisteredEdges();


        if (setLayout)
            this.setLayout();

        this.connectionsWantedToCreateByNodePair = {};
    }

    protected createPaths() {

        let BreakException = {};

        this.mappingStructure.paths.forEach((p) => {
            let cClass = p['dataConnectionClass'];
            let cEntityGetter = p['dataConnectionEntities'];
            let pathClass = p['path'];


            let pathNodes = [];
            cEntityGetter().forEach((c:BasicConnection, i) => {
                let nS:BasicEntity = c.getEntities()["src"];
                let nE:BasicEntity = c.getEntities()["dst"];

                if (i === 0) {
                    try {
                        nS.getRegisteredGraphElements().forEach((elm:NodeAbstract) => {
                            if (elm.getPlane().getId() === this.plane.getId()) {
                                pathNodes.push(elm);
                                throw BreakException;
                            }
                        });
                    } catch (e) {
                        if (e !== BreakException)
                            throw e;
                    }
                }

                try {
                    nE.getRegisteredGraphElements().forEach((elm:NodeAbstract) => {
                        if (elm.getPlane().getId() === this.plane.getId()) {
                            pathNodes.push(elm);
                            throw BreakException;
                        }
                    });
                } catch (e) {
                    if (e !== BreakException)
                        throw e;
                }

            });

            let path:NodepathAbstract = new pathClass(pathNodes, this.plane);
            this.plane.getGraphScene().addObject(path);
            // this.plane.getGraphScene().render();
        });


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

    protected registerConnectionsForSameTypeNodesOverAHop(srcNode:NodeAbstract, hopNodeDataEntityType, edgeClass) {
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

                    if (this.registerAndCheckExistingRequestedEdge(srcNode, n, edgeClass))
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
     */
    registerAndCheckExistingRequestedEdge(node1:NodeAbstract, node2:NodeAbstract, edgeClass, weight = false, connection:BasicConnection = null) {

        if (!node1 || !node2)
            return;

        let id1 = node1.getUniqueId();
        let id2 = node2.getUniqueId();
        let minId = Math.min(id1, id2);
        let maxId = Math.max(id1, id2);


        if (typeof this.connectionsWantedToCreateByNodePair[edgeClass.name] === "undefined")
            this.connectionsWantedToCreateByNodePair[edgeClass.name] = {};

        if (typeof this.connectionsWantedToCreateByNodePair[edgeClass.name][minId] === "undefined")
            this.connectionsWantedToCreateByNodePair[edgeClass.name][minId] = [];

        if (typeof this.connectionsWantedToCreateByNodePair[edgeClass.name][minId][maxId] !== "undefined") {
            this.connectionsWantedToCreateByNodePair[edgeClass.name][minId][maxId]['val']++;
            return;
        }
        this.connectionsWantedToCreateByNodePair[edgeClass.name][minId][maxId] = {
            val: 1,
            edge: null
        };
        this.connectionsWantedToCreateByNodePair[edgeClass.name][minId][maxId]['val'] = 1;
        this.connectionsWantedToCreateByNodePair[edgeClass.name][minId][maxId]['edgeClass'] = edgeClass;
        this.connectionsWantedToCreateByNodePair[edgeClass.name][minId][maxId]['n1'] = node1;
        this.connectionsWantedToCreateByNodePair[edgeClass.name][minId][maxId]['n2'] = node2;
        this.connectionsWantedToCreateByNodePair[edgeClass.name][minId][maxId]['weight_by_connectiondata'] = weight;
        this.connectionsWantedToCreateByNodePair[edgeClass.name][minId][maxId]['connection_entity'] = connection;


    }

    protected createRegisteredEdges() {

        for (var edgeType in this.connectionsWantedToCreateByNodePair) {
            for (var i1 in this.connectionsWantedToCreateByNodePair[edgeType]) {
                for (var i2 in this.connectionsWantedToCreateByNodePair[edgeType][i1]) {
                    let node1 = this.connectionsWantedToCreateByNodePair[edgeType][i1][i2]['n1'];
                    let node2 = this.connectionsWantedToCreateByNodePair[edgeType][i1][i2]['n2'];
                    let edgeClass = this.connectionsWantedToCreateByNodePair[edgeType][i1][i2]['edgeClass'];
                    let weight = this.connectionsWantedToCreateByNodePair[edgeType][i1][i2]['weight_by_connectiondata'];
                    let connectionEntity = this.connectionsWantedToCreateByNodePair[edgeType][i1][i2]['connection_entity'];
                    this.createEdge(node1, node2, edgeClass, weight, connectionEntity);
                }
            }
        }

    }

    protected createEdge(n1:NodeAbstract, n2:NodeAbstract, edgeClass, calculatedWeight = false, connectionEntity:BasicConnection = null) {



        /*
         Search for existing edge between the two nodes with same class
         */
        let BreakException = {};
        let existingEdgeToReturn:EdgeAbstract = null;
        try {
            n1.getEdges().forEach((existingEdge:EdgeAbstract) => {
                if (
                    existingEdge.constructor === edgeClass && (
                    existingEdge.getSourceNode().getUniqueId() === n1.getUniqueId() &&
                    existingEdge.getDestNode().getUniqueId() === n2.getUniqueId() ||
                    existingEdge.getSourceNode().getUniqueId() === n2.getUniqueId() &&
                    existingEdge.getDestNode().getUniqueId() === n1.getUniqueId() )) {
                    existingEdgeToReturn = existingEdge;
                    throw BreakException;
                }
            });
        } catch (e) {
            if (e !== BreakException)
                throw e;

            if (calculatedWeight !== false)
                existingEdgeToReturn.setWeight(Number(calculatedWeight));
            return existingEdgeToReturn;
        }

        let edge = null;
        if (connectionEntity)
            edge = new edgeClass(n1, n2, this.plane, connectionEntity);
        else
            edge = new edgeClass(n1, n2, this.plane);


        if (calculatedWeight !== false)
            edge.setWeight(calculatedWeight);
        n1.addEdge(edge);
        n2.addEdge(edge);
        this.edges.push(edge);
        this.plane.getGraphScene().addObject(edge);
        return edge;
    }


    protected setEdgeAndNodeWeightsAndCreateEdges() {
        // console.log(this.connectionsWantedToCreateByNodePair);


        // Normalize
        for (var edgeType in this.connectionsWantedToCreateByNodePair) {

            let min = null;
            let max = null;

            for (var i in this.connectionsWantedToCreateByNodePair[edgeType]) {
                for (var j in this.connectionsWantedToCreateByNodePair[edgeType][i]) {
                    let amount = this.connectionsWantedToCreateByNodePair[edgeType][i][j]['val'];
                    if (min === null)
                        min = amount;
                    if (max === null)
                        max = amount;
                    min = Math.min(min, amount);
                    max = Math.max(max, amount);
                }
            }
            for (var i in this.connectionsWantedToCreateByNodePair[edgeType]) {
                for (var j in this.connectionsWantedToCreateByNodePair[edgeType][i]) {
                    let amount = this.connectionsWantedToCreateByNodePair[edgeType][i][j]['val'];
                    let weight = (max - min) !== 0 ? (amount - min) / (max - min) : 0;

                    if (this.thinOut && weight <= this.thinOutThreshold)
                        continue;

                    let edge = this.createEdge(this.connectionsWantedToCreateByNodePair[edgeType][i][j]['n1'],
                        this.connectionsWantedToCreateByNodePair[edgeType][i][j]['n2'],
                        this.connectionsWantedToCreateByNodePair[edgeType][i][j]['edgeClass'],
                        false,
                        this.connectionsWantedToCreateByNodePair[edgeType][i][j]['connection_entity']);
                    edge.setWeight(weight);


                    let wSrc = edge.getSourceNode().getWeight() + weight;
                    let wDst = edge.getDestNode().getWeight() + weight;

                    if (!this.nodeWeightByUniqueEdges) {
                        edge.getSourceNode().setWeight(wSrc);
                        edge.getDestNode().setWeight(wDst);
                    }
                    else {
                        edge.getSourceNode().setWeight(wSrc);
                        edge.getDestNode().setWeight(wDst);
                    }

                    let maxNodeWeight = Math.max(wSrc, wDst);


                    if (typeof this.maxNodeWeight[edge.getSourceNode().constructor.name] === "undefined")
                        this.maxNodeWeight[edge.getSourceNode().constructor.name] = 0;
                    if (typeof this.maxNodeWeight[edge.getDestNode().constructor.name] === "undefined")
                        this.maxNodeWeight[edge.getDestNode().constructor.name] = 0;

                    this.maxNodeWeight[edge.getSourceNode().constructor.name] = Math.max(this.maxNodeWeight[edge.getSourceNode().constructor.name], maxNodeWeight);
                    this.maxNodeWeight[edge.getDestNode().constructor.name] = Math.max(this.maxNodeWeight[edge.getDestNode().constructor.name], maxNodeWeight);
                }
            }
        }
    }


    private setLayout() {
        this.layout = new this.layoutClass(this.plane, this.graphElements, this.edges);
        this.layout.setInitPositions(() => {
            this.layout.calculateLayout(function () {
                console.log("Finished calculating layout " + this.graphElements.length + " nodes, " + this.edges.length + " edges");
                this.createPaths();
                this.plane.getGraphScene().render();
                this.addEventListeners();
            }.bind(this), null);
        });
    }


    protected applyWeightsFromDataEntities() {

        this.graphElements.forEach((e:ElementAbstract) => {
            let w = e.getDataEntity().getData("weight");
            if (w !== null)
                (<NodeAbstract>e).setWeight(Number(w));
        });

        this.edges.forEach((e:EdgeAbstract) => {

        });

    }
}