import {MetanodeAbstract} from "../metanodeabstract";
import {NodeAbstract} from "../../nodes/nodeelementabstract";
import {Plane} from "../../../../plane/plane";
import {EdgeAbstract} from "../../edges/edgeelementabstract";
import {AnimationService} from "../../../../../services/animationservice";
import {GraphVisConfig} from "../../../config";
import {Pie} from "../pie";
import {Label} from "../../labels/label";
export class OnionVis extends MetanodeAbstract {

    private centerNode:NodeAbstract;
    protected labels:Label[];

    protected static onionSkins = [
        {
            max: 1
        },
        {
            max: 5
        },
        {
            max: 10
        }
    ];

    constructor(x:number, y:number, centerNode:NodeAbstract, plane:Plane) {

        super(x, y, [], plane, {'size': 50});
        this.name = "Onion-Vis Meta-Node";
        this.centerNode = centerNode;
        this.labels = [];
        window.setTimeout(function () {
            this.calculateDistances(centerNode);
            AnimationService.getInstance().collapseNodes(this.nodes, plane, centerNode.getPosition(), function () {
                this.createOnions(null);
                for (var meshKey in this.meshs) {
                    this.add(this.meshs[meshKey]);
                }
                this.plane.getGraphScene().render();

            }.bind(this));

        }.bind(this), 0);

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
        let size = this.centerNode['options'].size + sizeStep;
        let zVal = -1;
        let zStep = 2;
        OnionVis.onionSkins.forEach((onion) => {

            let matchingDistNodes = {};
            let nodesInThisRing = 0;


            this.nodes.forEach((n) => {
                let dist = n.getADistance(this.centerNode);
                if (dist < minDist || dist > onion.max)
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
            let labelRad = size - sizeStep / 2;
            let labelPosX = labelRad * Math.sin(Math.PI);
            let labelPosY = labelRad * Math.cos(Math.PI);
            let ringLabel = new Label(this.plane, "10-20", labelPosX, labelPosY, {
                rotateDegree: rotDegree,
                color: "#FFFFFF",
                fontSize: 18,
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
                let ringPie = new Pie(ringStart, ringStart + ringLength, size, matchingDistNodes[nodeClass][0].getColor(), zVal);
                oniongroup.add(ringPie);


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


            minDist = onion.max + 1;
            size += sizeStep;
            zVal -= zStep;
        });


        let centerDummyNode = new THREE.Mesh(new THREE.CircleGeometry(
            this.centerNode['options'].size,
            GraphVisConfig.graphelements.abstractnode.segments),
            new THREE.MeshBasicMaterial(
                {
                    color: this.centerNode.getColor()
                }));

        oniongroup.add(centerDummyNode);
        oniongroup.position.setZ(5);

        this.meshs['oniongroup'] = oniongroup;
    }


}
