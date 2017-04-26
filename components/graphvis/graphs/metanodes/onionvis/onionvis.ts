import {MetanodeAbstract} from "../metanodeabstract";
import {NodeAbstract} from "../../nodes/nodeelementabstract";
import {Plane} from "../../../../plane/plane";
import {EdgeAbstract} from "../../edges/edgeelementabstract";
import {AnimationService} from "../../../../../services/animationservice";
import {GraphVisConfig} from "../../../config";

import {Label} from "../../labels/label";
import match = require("core-js/fn/symbol/match");
import {OnionSegment} from "./onionsegment";
export class OnionVis extends MetanodeAbstract {

    private centerNode:NodeAbstract;
    protected labels:Label[];

    protected currentActiveOnionSegments:OnionSegment[] = [];

    protected static onlyOneOnionAllowed = true;
    protected static activeOnions:OnionVis[] = [];

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
        this.labels = [];

        //console.log("Onion constructor");

        let createOnionFct = function () {
            //console.log("Creating the new onion now! The centernode is ", centerNode);
            this.calculateDistances(centerNode);
            this.zoomAndCenter();
            this.collapseNodes(this.nodes, function () {
                this.setPosition(this.centerNode.getPosition().x, this.centerNode.getPosition().y);
                this.createOnions(null);
                for (var meshKey in this.meshs) {
                    this.add(this.meshs[meshKey]);
                }
                OnionVis.activeOnions.push(this);
                AnimationService.getInstance().finishAllAnimations();
                this.plane.setSelectedGraphElement(this);
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
    }

    protected collapseNodes(nodes:NodeAbstract[], cb, saveOrigPos = true) {
        AnimationService.getInstance().collapseNodes(this.nodes, this.plane, this.centerNode.getPosition(), cb, saveOrigPos);
    }

    protected expandOnionSegmentNodes(segment:OnionSegment, cb) {
        let nodes = segment.getAffectedNodes();

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
            n.setPosition(relPosX + this.centerNode.getPosition().x, relPosY + this.centerNode.getPosition().y);
            currAng += angleStep;
        });

        this.plane.getGraphScene().render();
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

            let path = route.path(centerNode.getUniqueId(), n.getUniqueId());
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
            let label = minDist !== onion.max ? minDist + (onion.max !== null ? "-" + onion.max : "+") : minDist;
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

                ringPieSegment.setOnClickFct(function (segment:OnionSegment) {
                    this.currentActiveOnionSegments.forEach((pieToCollapse:OnionSegment) => {
                        this.collapseNodes(pieToCollapse.getAffectedNodes(), null, false);
                    });
                    this.currentActiveOnionSegments = [];
                    this.currentActiveOnionSegments.push(segment);
                    AnimationService.getInstance().finishAllAnimations();
                    this.expandOnionSegmentNodes(segment, null);
                }.bind(this), ringPieSegment);


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

        oniongroup.add(centerDummyNode);
        oniongroup.position.setZ(5);

        this.meshs['oniongroup'] = oniongroup;
    }

    public delete(cb, restorePositions = true) {
        OnionVis.activeOnions.forEach((o:OnionVis, i) => {
            if (this.uniqueId === o.uniqueId)
                OnionVis.activeOnions.splice(i, 1);
        });
        AnimationService.getInstance().restoreNodeOriginalPositions([this.centerNode], this.plane, cb);
        super.delete(cb, restorePositions);
    }

}
