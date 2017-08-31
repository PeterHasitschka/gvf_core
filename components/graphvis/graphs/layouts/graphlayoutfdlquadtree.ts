import {GraphLayoutAbstract} from './graphlayoutabstract';
import {Plane} from '../../../plane/plane';
import {EdgeAbstract} from "../edges/edgeelementabstract";
import {NodeAbstract} from "../nodes/nodeelementabstract";
import {AnimationService} from "../../../../services/animationservice";
import {DataAbstract} from "../../data/dataabstract";

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


    public calculateLayout(onFinish, newNodes = null):void {
        // this.plane.setShowGreyOverlay(true);
        window.setTimeout(function () {
            this.calculate(false, null, newNodes);
            if (!newNodes)
                this.plane.getGraphScene().fitAllNodesInView(function () {
                    // this.plane.setShowGreyOverlay(false);
                    onFinish();
                }.bind(this));
            else
                this.plane.getGraphScene().render();
        }.bind(this), 0);

        return;
    }

    /**
     * Calculate a quadTreeLayout!
     * @param nodes Nodes to be set, but also those which are just here to be used to calculate the others position
     * @param newEntities   if not null, only the nodes with the data entity id found in this objects keys (!) are repositioned (values are irrelevant)
     * @param exclusiveEdgeClasses  @TODO not implemented yet. May be used to ignore different kind of edges
     * @param doHiddenNodes If true, all nodes are taken into accout. Else only visible#
     * @returns {{nodeData: Array, rect: any}}
     */
    public static quadTreeLayout(nodes:NodeAbstract[], newEntities = null, exclusiveEdgeClasses = null, doHiddenNodes = false) {


        var createGraph = require('ngraph.graph');
        var g = createGraph();

        let tmpNodeMapping = {};

        nodes.forEach((n:NodeAbstract) => {

            if (!doHiddenNodes && !n.getIsVisible())
                return;


            tmpNodeMapping[n.getUniqueId()] = n;

            n.getEdges().forEach((e:EdgeAbstract) => {
                let connectedNode:NodeAbstract;
                if (e.getDestNode() !== n)
                    connectedNode = e.getDestNode();
                else
                    connectedNode = e.getSourceNode();


                if (doHiddenNodes || connectedNode.getIsVisible())
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

        if (newEntities) {
            nodes.forEach((n:NodeAbstract) => {
                if (!n.getIsVisible() && !doHiddenNodes)
                    return;
                if (!(n.getDataEntity().getId() in newEntities)) {
                    layout.setNodePosition(n.getUniqueId(), n.getPosition()['x'], n.getPosition()['y']);
                    let nodeToPin = g.getNode(n.getUniqueId());
                    layout.pinNode(nodeToPin, true);
                }
            });
        }

        for (var i = 0; i < 1000; ++i) {
            layout.step();
        }

        let retArr = [];

        g.forEachNode(function (n) {
            if (typeof tmpNodeMapping[n.id] === "undefined")
                return;
            let pos = layout.getNodePosition(n.id);
            let node = <NodeAbstract>tmpNodeMapping[n.id];
            retArr.push({node: node, pos: pos});
        });
        return {nodeData: retArr, rect: layout.getGraphRect()}
    }


    private calculate(animation:boolean = false, cb = null, newNodes = null) {

        let calculated = GraphLayoutFdlQuadtree.quadTreeLayout(this.nodes, newNodes, null);

        let nodesToFinishAnim = calculated.nodeData.length;
        calculated.nodeData.forEach(function (nData) {
            let pos = nData.pos;
            let node = nData.node;

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
                    0.1,
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

