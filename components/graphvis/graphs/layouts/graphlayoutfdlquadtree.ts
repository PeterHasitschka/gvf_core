import {GraphLayoutAbstract} from './graphlayoutabstract';
import {Plane} from '../../../plane/plane';
import {EdgeAbstract} from "../edges/edgeelementabstract";
import {NodeAbstract} from "../nodes/nodeelementabstract";
import {AnimationService} from "../../../../services/animationservice";

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
        }.bind(this), 0);

        return;
    }


    private calculate(animation:boolean = false, cb = null) {
        var createGraph = require('ngraph.graph');
        var g = createGraph();

        let tmpNodeMapping = {};

        this.nodes.forEach((n:NodeAbstract) => {

            if (!n.getIsVisible())
                return;

            tmpNodeMapping[n.getUniqueId()] = n;

            n.getEdges().forEach((e:EdgeAbstract) => {
                let connectedNode:NodeAbstract;
                if (e.getDestNode() !== n)
                    connectedNode = e.getDestNode();
                else
                    connectedNode = e.getSourceNode();

                if (connectedNode.getIsVisible())
                    g.addLink(n.getUniqueId(), connectedNode.getUniqueId());
            });
        });

        var physicsSettings = {
            springLength: 30,
            springCoeff: 0.0008,
            gravity: -1.2,
            theta: 0.8,
            dragCoeff: 0.02,
            timeStep: 5
        };

        var layout = require('ngraph.forcelayout')(g, physicsSettings);
        for (var i = 0; i < 1000; ++i) {
            layout.step();
        }

        let nodesToFinishAnim = g.getNodesCount();
        g.forEachNode(function (n) {
            let pos = layout.getNodePosition(n.id);

            let node = <NodeAbstract>tmpNodeMapping[n.id];
            if (!animation) {
                node.setPosition(pos.x, pos.y);
            } else {

                AnimationService.getInstance().register(
                    "nodepos_" + node.getUniqueId(),
                    {'x': pos.x, 'y': pos.y},
                    null,
                    node.getPosition2DForAnimation.bind(node),
                    node.setPosition2DForAnimation.bind(node),
                    0,
                    1,
                    0.00001,
                    0.1,
                    function () {
                        nodesToFinishAnim--;
                        if (!nodesToFinishAnim && cb)
                            cb();
                    }.bind(this),
                    true,
                    node.getPlane()
                );
            }

        });

    }


    public reCalculateLayout(onFinish):void {
        this.calculate(true, onFinish);
    }

}

