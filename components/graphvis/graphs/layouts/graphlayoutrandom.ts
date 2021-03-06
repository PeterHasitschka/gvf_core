import {GraphLayoutAbstract} from './graphlayoutabstract';
import {Plane} from '../../../plane/plane';
import {EdgeAbstract} from "../edges/edgeelementabstract";
import {NodeAbstract} from "../nodes/nodeelementabstract";

/**
 * Dummy-Random layout. The graphelements just get set randomly on the plane
 */
export class GraphLayoutRandom extends GraphLayoutAbstract {

    /**
     * Constructor
     * @param plane
     * @param nodes
     * @param edges
     */
    constructor(protected plane:Plane, nodes:NodeAbstract[], edges:EdgeAbstract[]) {
        super(plane, nodes, edges);
    }

    public setInitPositions(onFinish):void {
        window.setTimeout(function () {
            this.distributeRandom(onFinish);

        }.bind(this), 0)
    }


    public calculateLayout(onFinish):void {

        let DEMOANIMATE = false;

        if (DEMOANIMATE) {
            let i = 0;
            var calcFct = function () {
                if (i >= 100) {
                    this.plane.getGraphScene().render();
                    onFinish();
                    return;
                }
                requestAnimationFrame(calcFct);

                i++;
                this.nodes.forEach((node:NodeAbstract) => {
                    let pos = node.getPosition();


                    let x = Math.sin(pos['x']) * 6.0;
                    let y = Math.cos(pos['y']) * 6.0;
                    node.setPosition(pos['x'] - x, pos['y'] + y);
                });
                if (i % 1 == 0)
                    this.plane.getGraphScene().render();
            }.bind(this);
            calcFct();
        } else
            onFinish();


    }

}

