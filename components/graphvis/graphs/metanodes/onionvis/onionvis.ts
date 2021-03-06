import {MetanodeAbstract} from "../metanodeabstract";
import {NodeAbstract} from "../../nodes/nodeelementabstract";
import {Plane} from "../../../../plane/plane";
import {EdgeAbstract} from "../../edges/edgeelementabstract";
import {AnimationService} from "../../../../../services/animationservice";
import {GraphVisConfig} from "../../../config";

import {Label} from "../../labels/label";
import match = require("core-js/fn/symbol/match");
import {OnionSegment} from "./onionsegment";
import {EdgeBasic} from "../../edges/edgeelementbasic";
import {NoAnnotationError} from "@angular/core";
import {EdgeColored} from "../../edges/edgeelementcolored";
export class OnionVis extends MetanodeAbstract {

    private centerNode:NodeAbstract;
    private centerPos:{} = null;
    protected labels:Label[];

    protected static onionConnectingEdges:EdgeAbstract[] = [];

    protected onionToNodeEdges:EdgeAbstract[] = [];
    protected hiddenOriginalEdges = {};

    protected currentActiveOnionSegments:OnionSegment[] = [];

    protected static onlyOneOnionAllowed = false;
    protected static activeOnions:OnionVis[] = [];

    protected useMinDist = false;

    protected hoverLabel:Label;


    protected static onionSkins = [
        {
            max: 1
        },
        {
            max: 5
        },
        {
            max: 10
        },
        {
            max: null
        }
    ];


    constructor(x:number, y:number, centerNode:NodeAbstract, plane:Plane) {

        super(x, y, [], plane, {'size': 50});
        this.name = "Onion-Vis Meta-Node";
        this.centerNode = centerNode;
        this.centerPos = centerNode.getPosition().clone();
        this.labels = [];


        let createOnionFct = function () {
            centerNode.setPosition(this.centerPos.x, this.centerPos.y);
            //console.log("Creating the new onion now! The centernode is ", centerNode);
            this.calculateDistances(centerNode);
            // this.zoomAndCenter();
            this.collapseNodes(this.nodes, function () {
                this.setPosition(this.centerNode.getPosition().x, this.centerNode.getPosition().y);

                this.createOnions(null);
                for (var meshKey in this.meshs) {
                    this.add(this.meshs[meshKey]);
                }

                OnionVis.activeOnions.push(this);
                this.reCreateOnionConnections();
                AnimationService.getInstance().finishAllAnimations();
                this.plane.setSelectedGraphElement(this);

                // Hide all edges on first onion
                if (OnionVis.activeOnions.length === 1) {
                    this.nodes.forEach((n:NodeAbstract) => {
                        n.getEdges().forEach((e:EdgeAbstract) => {
                            this.hiddenOriginalEdges[e.uuid] = e;
                            e.setIsVisible(false);
                        });
                    });
                }

                this.plane.getGraphScene().render();

            }.bind(this));


        }.bind(this);

        /*
         If an onionvis already exists, delete it.
         */
        if (this.plane.getSelectedGraphElement().constructor === OnionVis) {
            //console.log("An onion was selected... deselect");
            this.plane.deselectSelectedGraphElement();
        }

        if (OnionVis.onlyOneOnionAllowed && OnionVis.activeOnions.length) {
            // console.log("Delete all existing onions first...");
            let onionsToEat = OnionVis.activeOnions.length;
            OnionVis.activeOnions.forEach((o:OnionVis) => {
                // console.log("delete an onion...");
                o.delete(function () {
                    // console.log("Finished deleting one onion...");
                    onionsToEat--;
                    if (onionsToEat === 0) {
                        // console.log("All onions deleted.");
                        createOnionFct();
                    }
                }.bind(this), false);
            });
        } else
            createOnionFct();


        this.hoverLabel = new Label(this.plane, "", 0, -130, {
            color: "#7B83B3",
            fontSize: 15,
            hidden: true,
            strokeColor: null
        });
        this.add(this.hoverLabel);

    }

    /**
     * Delete all existing connections between all onions.
     * Re-Create them then
     */
    protected reCreateOnionConnections() {
        OnionVis.onionConnectingEdges.forEach((e:EdgeAbstract) => {
            this.plane.getGraphScene().removeObject(e);
        });
        OnionVis.onionConnectingEdges = [];

        if (OnionVis.activeOnions.length > 1) {

            OnionVis.activeOnions.forEach((o:OnionVis, oIdx) => {
                if (oIdx === 0)
                    return;
                let lastO:OnionVis = OnionVis.activeOnions[oIdx - 1];
                o.resetCenterNodePosition();
                lastO.resetCenterNodePosition();
                let connectingEdge = new EdgeColored(lastO.getCenterNode(), o.centerNode, this.plane, 0xFF0000);
                this.plane.getGraphScene().addObject(connectingEdge);
                OnionVis.onionConnectingEdges.push(connectingEdge);
            });

        }
        // OnionVis.activeOnions.forEach((o:OnionVis) => {
        //     o.removeTmpEdges();
        //     o.resetAllPositions();
        // });
    }

    protected collapseNodes(nodes:NodeAbstract[], cb, saveOrigPos = true, animation = true) {


        let afterCollapse = function () {
            if (cb)
                cb();
        }.bind(this);

        // Only collapse on first onion
        if (OnionVis.activeOnions.length > 0) {
            afterCollapse();
            return;
        }

        this.removeTmpEdges();

        console.log("COLLAPSE on onion " + this.getDataEntity().getId() + " called");

        if (animation)
            AnimationService.getInstance().collapseNodes(nodes, this.plane, this.centerNode.getPosition(), afterCollapse, saveOrigPos);
        else {
            nodes.forEach((n:NodeAbstract) => {
                if (n === null)
                    return;
                n.setPosition(this.centerNode.getPosition()['x'], this.centerNode.getPosition()['y']);
                if (saveOrigPos)
                    n.saveOrigPosition();
                afterCollapse();
            })
        }
    }


    public isNodeExpanded(nodeToCheck:NodeAbstract) {

        let BreakException = {};
        let isExpanded = false;
        try {
            this.currentActiveOnionSegments.forEach((segment:OnionSegment) => {
                segment.getAffectedNodes().forEach((nOfSeg:NodeAbstract) => {
                    if (nodeToCheck.getUniqueId() === nOfSeg.getUniqueId()) {
                        isExpanded = true;
                        throw BreakException;
                    }
                });
            });
        } catch (e) {
            if (e !== BreakException)
                throw e;
        }

        return isExpanded;
    }


    protected expandOnionSegmentNodes(segment:OnionSegment, cb) {

        this.centerNode.setPosition(this.centerPos['x'], this.centerPos['y']);

        let nodes = this.getBestOfNodes(segment.getAffectedNodes());

        let angles = segment.getAngles();

        let angleLength = angles.end - angles.start;
        let angleStep = angleLength / nodes.length;

        let radius = 400;

        let currAng = angles.start;
        // console.log("expand around centernode", this.centerNode);
        nodes.forEach((n:NodeAbstract) => {

            let randVal = 1; //Math.random() + 0.5;
            let tmpRad = radius * randVal;
            let relPosX = tmpRad * Math.sin(currAng);
            let relPosY = tmpRad * Math.cos(currAng);

            let isExpandedByOtherOnion = false;

            let BreakException = {};
            try {
                OnionVis.activeOnions.forEach((o:OnionVis) => {
                    if (o.getDataEntity().getId() === this.getDataEntity().getId())
                        return;
                    if (o.isNodeExpanded(n)) {
                        isExpandedByOtherOnion = true;
                        throw BreakException;
                    }
                });


            } catch (e) {
                if (e !== BreakException)
                    throw e;
            }
            console.log(isExpandedByOtherOnion);
            if (!isExpandedByOtherOnion)
                n.setPosition(relPosX + this.centerNode.getPosition().x, relPosY + this.centerNode.getPosition().y);
            currAng += angleStep;


            let tmpEdge:EdgeBasic = new EdgeColored(n, this.centerNode, this.plane, 0x0000FF);
            this.onionToNodeEdges.push(tmpEdge);
            this.plane.getGraphScene().addObject(tmpEdge);

        });

        this.plane.getGraphScene().render();
    }

    protected getBestOfNodes(nodes:NodeAbstract[]) {
        let outArray = [];

        nodes.forEach((n:NodeAbstract, i) => {
            if (i < 10)
                outArray.push(n);
        });
        return outArray;
    }


    /**
     * Calculate the shortest distances to connected nodes using the DIJKSTRA algorithm.
     * Stored within this.distanceMap
     * @param centerNode
     */
    protected calculateDistances(centerNode:NodeAbstract) {
        let dijkstraGraph = require('node-dijkstra');

        /*
         Build a mapping of the graph
         */
        let mappedGraph = {};
        this.plane.getGraph().getGraphElements().forEach((n) => {
            if (!(n instanceof NodeAbstract))
                return;
            n = <NodeAbstract>n;
            mappedGraph[n.getUniqueId()] = {};
            n.getEdges().forEach((edge:EdgeAbstract) => {
                let connectedNode:NodeAbstract = edge.getSourceNode() === n ? edge.getDestNode() : edge.getSourceNode();
                mappedGraph[n.getUniqueId()][connectedNode.getUniqueId()] = 1;
            });
        });

        let route = new dijkstraGraph(mappedGraph);

        /*
         Calculate the distance of each node to the current centerNode
         Distance is stored inside node, and it is pushed to the super node array
         */
        this.plane.getGraph().getGraphElements().forEach((n) => {
            if (!(n instanceof NodeAbstract))
                return;

            if (centerNode.getUniqueId() === n.getUniqueId())
                return;

            let path = route.path(centerNode.getUniqueId().toString(), n.getUniqueId().toString());

            if (path !== null) {
                (<NodeAbstract>n).setADistance(centerNode, path.length - 1);
                this.nodes.push((<NodeAbstract>n));
            }
        });
    }

    protected createMeshs(options) {
    }

    protected createOnions(options) {

        let oniongroup = new THREE.Group();
        // options = {size: 20};
        // super.createMeshs(options);

        let minDist = 1;

        let sizeStep = 20;
        let size = (this.centerNode['options']['size'] ? this.centerNode['options']['size'] : 10 ) + sizeStep;
        let zVal = -1;
        let zStep = 2;
        let groupedNodes = [];
        OnionVis.onionSkins.forEach((onion) => {
            let matchingDistNodes = {};
            let nodesInThisRing = 0;


            this.nodes.forEach((n) => {
                let dist = n.getADistance(this.centerNode);
                if (dist < minDist || (onion.max !== null && dist > onion.max))
                    return;
                if (typeof matchingDistNodes[n.constructor.name] === "undefined")
                    matchingDistNodes[n.constructor.name] = [];

                matchingDistNodes[n.constructor.name].push(n);
                nodesInThisRing++;
            });

            if (nodesInThisRing === 0)
                return;


            // Ring Label
            let rotDegree = 0;
            let labelRad = size - sizeStep / 2 - 5;
            let labelPosX = labelRad * Math.sin(Math.PI);
            let labelPosY = labelRad * Math.cos(Math.PI);

            let label;
            if (this.useMinDist)
                label = minDist !== onion.max ? minDist + (onion.max !== null ? "-" + onion.max : "+") : minDist;
            else
                label = onion.max !== null ? "<" + (onion.max + 1) : "all";

            let ringLabel = new Label(this.plane, label, labelPosX, labelPosY, {
                rotateDegree: rotDegree,
                color: "#FFFFFF",
                fontSize: 17,
                strokeColor: "#888888",
                hidden: false
            });
            oniongroup.add(ringLabel);
            this.labels.push(ringLabel);


            // Create segments
            let ringStart = 0.0;
            for (var nodeClass in matchingDistNodes) {
                let ratio = matchingDistNodes[nodeClass].length / nodesInThisRing;
                let ringLength = Math.PI * 2 * ratio;
                let ringPieSegment = new OnionSegment(ringStart, ringStart + ringLength, size, matchingDistNodes[nodeClass][0].getColor(), zVal);
                oniongroup.add(ringPieSegment);

                ringPieSegment.setAffectedNodes(matchingDistNodes[nodeClass]);


                /*
                 Label
                 */
                let ringLengthHalf = ringStart + ringLength / 2;

                let labelRad = size - sizeStep / 2;
                let labelPosX = labelRad * Math.sin(ringLengthHalf);
                let labelPosY = labelRad * Math.cos(ringLengthHalf);

                let rotDegree = (ringLengthHalf) * 360 / (Math.PI * 2);
                let numNodesLabel = new Label(this.plane, matchingDistNodes[nodeClass].length, labelPosX, labelPosY, {
                    rotateDegree: rotDegree,
                    color: "#0000FF",
                    fontSize: 10,
                    strokeColor: "#888888",
                    hidden: false
                });
                oniongroup.add(numNodesLabel);
                this.labels.push(numNodesLabel);


                ringStart += ringLength;

                ringPieSegment.setOnClickFct(function (segment:OnionSegment) {

                    // OnionVis.activeOnions.forEach((o:OnionVis) => {
                    //     o.resetAllPositions();
                    // });

                    this.currentActiveOnionSegments = [];
                    this.currentActiveOnionSegments.push(segment);
                    AnimationService.getInstance().finishAllAnimations();
                    this.expandOnionSegmentNodes(segment, null);
                }.bind(this), ringPieSegment);

                let infoStr = "All " + nodeClass + " nodes" + (onion.max !== null ? " with a minimal distance up to " + onion.max + " from the center node" : "");
                ringPieSegment.setIntersectFunctions(function () {
                        this.showHover(infoStr);
                    }.bind(this),
                    function () {
                        this.hideHover();
                    }.bind(this));


            }


            // Separation ring
            let sepRing = new THREE.Mesh(new THREE.CircleGeometry(
                    size + 1,
                GraphVisConfig.graphelements.abstractnode.segments),
                new THREE.MeshBasicMaterial(
                    {
                        color: 0xFFFFFF
                    }));
            sepRing.position.setZ(zVal - 1);
            oniongroup.add(sepRing);

            if (this.useMinDist)
                minDist = onion.max !== null ? onion.max + 1 : null;
            size += sizeStep;
            zVal -= zStep;
        });

        let centerDummyNode = new THREE.Mesh(new THREE.CircleGeometry(
            this.centerNode['options']['size'],
            GraphVisConfig.graphelements.abstractnode.segments),
            new THREE.MeshBasicMaterial(
                {
                    color: this.centerNode.getColor()
                }));

        centerDummyNode['onClick'] = function () {
            this.delete(null);
        }.bind(this);

        oniongroup.add(centerDummyNode);
        oniongroup.position.setZ(20);

        this.meshs['oniongroup'] = oniongroup;
    }

    /**
     * Collapse all open segments.
     * Reset center node position
     */
    public resetAllPositions() {
        console.log("RESETTING POSITIONS OF NODES IN ONION", this.nodes, this.dataEntity.getId());
        this.collapseNodes(this.nodes, null, false, false);
        this.resetCenterNodePosition();
    }

    /**
     * Resetting of position of centernode to the onion-center.
     * Might change, since other onions could take it and collapse it to their center.
     */
    public resetCenterNodePosition() {
        this.centerNode.setPosition(this.centerPos['x'], this.centerPos['y']);
    }

    /**
     * Remove all connections between the onion-center and the expanded nodes.
     */
    public removeTmpEdges() {

        this.onionToNodeEdges.forEach((e:EdgeAbstract) => {
            this.plane.getGraphScene().removeObject(e);
        });
        this.onionToNodeEdges = [];
    }

    /**
     * Delete everything
     * @param cb
     * @param restorePositions Restore the original positions of the nodes
     */
    public delete(cb, restorePositions = true) {

        this.resetAllPositions();

        this.removeTmpEdges();
        /*
         Remove this onion from the static list
         */
        OnionVis.activeOnions.forEach((o:OnionVis, i) => {
            if (this.uniqueId === o.uniqueId)
                OnionVis.activeOnions.splice(i, 1);
        });


        /**
         * Check if nodes of the onion to delete are in other instances.
         * If so, DO NOT restore them.
         */
        let allNodeMapping = {};
        // Make a mapped list of all nodes currently inside an onion
        OnionVis.activeOnions.forEach((o:OnionVis) => {
            if (o.uniqueId === this.uniqueId)
                return;
            o.getNodes().forEach((n:NodeAbstract) => {
                if (typeof allNodeMapping[n.getUniqueId()] === "undefined")
                    allNodeMapping[n.getUniqueId()] = n;
            });
            if (typeof allNodeMapping[o.getCenterNode().getUniqueId()] === "undefined")
                allNodeMapping[o.getCenterNode().getUniqueId()] = o.getCenterNode();
            // o.resetAllPositions();
        });


        /*
         * Make all edges visible again which do not match other onions
         */
        this.nodes.forEach((n:NodeAbstract) => {
            if (n === null)
                return;

            n.getEdges().forEach((eToRestore:EdgeAbstract) => {

                if (!eToRestore.getIsVisible() && (typeof this.hiddenOriginalEdges[eToRestore.uuid] !== "undefined"))
                    eToRestore.setIsVisible(true);
            });
        });

        /*
         * Make all edges visible again which have expanded nodes that are directly connected to the own centernode
         */
        this.currentActiveOnionSegments.forEach((os:OnionSegment) => {
            os.getAffectedNodes().forEach((n:NodeAbstract) => {
                n.getEdges().forEach((eToRestore:EdgeAbstract) => {

                    if (eToRestore.getSourceNode().getUniqueId() === this.centerNode.getUniqueId() && eToRestore.getDestNode().getUniqueId() === n.getUniqueId() ||
                        eToRestore.getDestNode().getUniqueId() === this.centerNode.getUniqueId() && eToRestore.getSourceNode().getUniqueId() === n.getUniqueId() && !eToRestore.getIsVisible()
                    ) {
                        eToRestore.setIsVisible(true);
                    }
                });
            });

        });


        // Check if own nodes are affected by other onions (=inside that list)
        // If so, delete them from the own node list, to prevent restoration
        this.nodes.forEach((n:NodeAbstract, nodeIdx) => {
            if (typeof allNodeMapping[n.getUniqueId()] !== "undefined") {
                this.nodes[nodeIdx] = null;
            }
        });
        if (typeof allNodeMapping[this.centerNode.getUniqueId()] !== "undefined") {
            this.centerNode = null;
        }


        this.remove(this.hoverLabel);
        this.hoverLabel.delete();
        this.hoverLabel = null;

        // Restore the center node (if not already set to null due to another onion holding it)
        AnimationService.getInstance().restoreNodeOriginalPositions([this.centerNode], this.plane, null);


        let callbackFct = function () {
            OnionVis.activeOnions.forEach((o:OnionVis) => {
                if (o.uniqueId === this.uniqueId)
                    return;
                o.resetAllPositions();
            });
            if (cb)
                cb();
        }.bind(this);

        super.delete(callbackFct, restorePositions);
        this.reCreateOnionConnections();
        this.plane.getGraphScene().render();
    }


    protected showHover(text) {
        this.hoverLabel.updateText(text);
        this.hoverLabel.show();
    }

    public getCenterNode():NodeAbstract {
        return this.centerNode;
    }

    protected hideHover() {
        this.hoverLabel.hide();
    }

    public getNodes():NodeAbstract[] {
        return this.nodes;
    };
}
