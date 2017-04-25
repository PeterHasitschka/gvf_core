import {GraphLayoutAbstract} from './graphlayoutabstract';
import {Plane} from '../../../plane/plane';
import {EdgeAbstract} from "../edges/edgeelementabstract";
import {NodeAbstract} from "../nodes/nodeelementabstract";

export enum WORKER_MSGS {
    STARTCALCULATING,
    FINISHEDCALCULATION,
    ERROR
}
;

/**
 * Force-Directed-Layout for Graphs
 */
export class GraphLayoutFdlQuadtree extends GraphLayoutAbstract {


    constructor(protected plane:Plane, nodes:NodeAbstract[], edges:EdgeAbstract[]) {
        super(plane, nodes, edges);
    }

    public setInitPositions(onFinish):void {
        //this.distributeRandom(onFinish);
        onFinish();
    }


    public calculateLayout(onFinish):void {
        this.plane.setShowGreyOverlay(true);
        window.setTimeout(function () {
            this.calculate();
            this.plane.getGraphScene().fitAllNodesInView(function () {
                this.plane.setShowGreyOverlay(false);
                onFinish();
            }.bind(this));
        }.bind(this),0);

        return;
    }


    private calculate() {
        var createGraph = require('ngraph.graph');
        var g = createGraph();

        let tmpNodeMapping = {};

        this.nodes.forEach((n:NodeAbstract) => {
            tmpNodeMapping[n.getUniqueId()] = n;

            n.getEdges().forEach((e:EdgeAbstract) => {
                let connectedNode:NodeAbstract;
                if (e.getDestNode() !== n)
                    connectedNode = e.getDestNode();
                else
                    connectedNode = e.getSourceNode();
                g.addLink(n.getUniqueId(), connectedNode.getUniqueId());
            });
        });

        var physicsSettings = {
            springLength: 30,
            springCoeff: 0.0008,
            gravity: -1.2,
            theta: 0.8,
            dragCoeff: 0.02,
            timeStep: 20
        };

        var layout = require('ngraph.forcelayout')(g, physicsSettings);
        for (var i = 0; i < 1000; ++i) {
            layout.step();
        }

        g.forEachNode(function (node) {
            let pos = layout.getNodePosition(node.id);
            (<NodeAbstract>tmpNodeMapping[node.id]).setPosition(pos.x, pos.y);
        });

    }
}

