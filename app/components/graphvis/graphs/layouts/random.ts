import {GraphLayoutAbstract} from './abstract';
import {NodeAbstract} from '../nodes/abstract';
import {Plane} from '../../../plane/plane';

export class GraphLayoutRandom extends GraphLayoutAbstract {
    
    constructor(protected plane: Plane) {
        super(plane);
    }

    public calculatePositions(nodes: NodeAbstract[], onFinish): void {

        let dimensions = this.plane.calculateCanvasSize();
        let xRange = dimensions['x'] - 20;
        let yRange = dimensions['y'] - 20;
        nodes.forEach(function(node: NodeAbstract, idx: number) {
            var posX = Math.random() * xRange - xRange / 2;
            var posY = Math.random() * yRange - yRange / 2;
            node.setPosition(posX, posY);
        });
        onFinish();
    }

}