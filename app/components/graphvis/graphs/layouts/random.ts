import {GraphLayoutAbstract} from './abstract';
import {NodeAbstract} from '../nodes/abstract';
import {Plane} from '../../../plane/plane';

export class GraphLayoutRandom extends GraphLayoutAbstract {

    constructor(protected plane:Plane) {
        super(plane);
    }

    public setInitPositions(nodes:NodeAbstract[], onFinish):void {

        let padding = 50;
        let dimensions = this.plane.calculateCanvasSize();
        let xRange = dimensions['x'] - padding;
        let yRange = dimensions['y'] - padding;
        nodes.forEach(function (node:NodeAbstract, idx:number) {
            var posX = Math.random() * xRange - xRange / 2;
            var posY = Math.random() * yRange - yRange / 2;
            node.setPosition(posX, posY);
        });
        onFinish();
    }


    public calculateLayout(nodes:NodeAbstract[], onFinish):void {

        onFinish();

        // let i = 0;
        // var calcFct = function () {
        //     if (i >= 40) {
        //         this.plane.getGraphScene().render();
        //         onFinish();
        //         return;
        //     }
        //     requestAnimationFrame(calcFct);
        //
        //     i++;
        //     nodes.forEach((node:NodeAbstract) => {
        //         let pos = node.getPosition();
        //
        //
        //         let x = pos['x'] / 100;
        //         let y = pos['y'] / 100;
        //         node.setPosition(pos['x'] - x, pos['y'] + y);
        //     });
        //     if (i % 10 == 0)
        //         this.plane.getGraphScene().render();
        // }.bind(this);
        // calcFct();


    }

}

