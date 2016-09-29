import {GraphLayoutAbstract} from './abstract';
import {NodeAbstract} from '../nodes/abstract';
import {Plane} from '../../../plane/plane';
import {EdgeAbstract} from "../edges/abstract";

/**
 * Dummy-Random layout. The nodes just get set randomly on the plane
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

        let padding = 50;
        let dimensions = this.plane.calculateCanvasSize();
        let xRange = dimensions['x'] - padding;
        let yRange = dimensions['y'] - padding;
        this.nodes.forEach(function (node:NodeAbstract, idx:number) {
            var posX = Math.random() * xRange - xRange / 2;
            var posY = Math.random() * yRange - yRange / 2;
            node.setPosition(posX, posY);
        });
        onFinish();
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

