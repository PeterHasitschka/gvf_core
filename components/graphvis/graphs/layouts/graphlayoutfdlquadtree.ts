import {GraphLayoutAbstract} from './graphlayoutabstract';
import {Plane} from '../../../plane/plane';
import {EdgeAbstract} from "../edges/edgeelementabstract";
import {NodeAbstract} from "../nodes/nodeelementabstract";

/**
 * Force-Directed-Layout for Graphs
 */
export class GraphLayoutFdlQuadtree extends GraphLayoutAbstract {


    constructor(protected plane:Plane, nodes:NodeAbstract[], edges:EdgeAbstract[]) {
        super(plane, nodes, edges);
    }

    public setInitPositions(onFinish):void {
        this.distributeRandom(onFinish);
    }


    public calculateLayout(onFinish):void {

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

        var layout = require('ngraph.forcelayout')(g);
        for (var i = 0; i < 1000; ++i) {
            layout.step();
        }

        g.forEachNode(function (node) {
            let pos = layout.getNodePosition(node.id);
            (<NodeAbstract>tmpNodeMapping[node.id]).setPosition(pos.x, pos.y);
        });

        onFinish();
    }
}

