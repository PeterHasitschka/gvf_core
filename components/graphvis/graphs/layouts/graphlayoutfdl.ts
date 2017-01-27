import {GraphLayoutAbstract} from './graphlayoutabstract';
import {Plane} from '../../../plane/plane';
import {EdgeAbstract} from "../edges/edgeelementabstract";
import {NodeAbstract} from "../nodes/nodeelementabstract";

/**
 * Force-Directed-Layout for Graphs
 */
export class GraphLayoutFdl extends GraphLayoutAbstract {

    protected NODE_REPULSION_FACTOR = 50;
    protected EDGE_FORCE_FACTOR = 0.01;
    protected VELOCITY = 0.8;
    protected WALL_REPULSION_FACTOR = 300;
    protected ITERATIONS = 250;
    protected VEOLOCITY_REDUCTION_DAMPING = 4000;

    protected currentIteration = 0;

    constructor(protected plane:Plane, nodes:NodeAbstract[], edges:EdgeAbstract[]) {
        super(plane, nodes, edges);
    }

    public setInitPositions(onFinish):void {
        this.distributeRandom(onFinish);
    }


    public calculateLayout(onFinish):void {


        var loopFct = function () {
            this.reCalcPositions();

            this.edges.forEach((edge:EdgeAbstract) => {
                edge.updatePositions();
            });

            // if (this.currentIteration % 3 === 0)
            this.plane.getGraphScene().render();

            this.currentIteration++;
            if (this.currentIteration < this.ITERATIONS)
                requestAnimationFrame(loopFct);
            //loopFct();
            else {

                onFinish()
            }
        }.bind(this);
        loopFct();

    }


    private reCalcPositions() {


        /**
         * Template for this simple FDL algorithm:
         * http://blog.ivank.net/force-based-graph-drawing-in-as3.html
         */

        /**
         * Loop through all graphelements
         */
        this.nodes.forEach((nodeV:NodeAbstract) => {

            /**
             * Init force and velocity
             */

            nodeV['force'] = {
                x: 0,
                y: 0
            };

            nodeV['velocity'] = {
                x: 0,
                y: 0
            };

            /**
             * Go through all other graphelements to calculate distances
             */
            this.nodes.forEach((nodeU:NodeAbstract) => {

                if (nodeV.getDataEntity().getId() === nodeU.getDataEntity().getId())
                    return;


                let distance = nodeV.getDistance(nodeU);
                nodeV['force'].x += this.NODE_REPULSION_FACTOR * nodeV.getDistance(nodeU, 'x') / distance;
                nodeV['force'].y += this.NODE_REPULSION_FACTOR * nodeV.getDistance(nodeU, 'y') / distance;
            });

            /**
             * Calculate force between V and all its CONNECTED graphelements
             */
            nodeV.getEdges().forEach((edge:EdgeAbstract) => {
                let n1:NodeAbstract = edge.getSourceNode();
                let n2:NodeAbstract = edge.getDestNode();

                let nodeU:NodeAbstract = n1.getDataEntity().getId() === nodeV.getDataEntity().getId() ? n2 : n1;
                nodeV['force'].x += nodeU.getDistance(nodeV, 'x') * this.EDGE_FORCE_FACTOR;
                nodeV['force'].y += nodeU.getDistance(nodeV, 'y') * this.EDGE_FORCE_FACTOR;
            });


            /**
             * Calculate wall repulsion
             *
             */
            let canvWHalf = this.plane.getCanvasSize()['x'] / 2.0;
            let canvHHalf = this.plane.getCanvasSize()['y'] / 2.0;
            let posX = nodeV.getPosition()['x'];
            let posY = nodeV.getPosition()['y'];
            let wallDistX = posX <= 0 ? 0 - (canvWHalf) - posX : (canvWHalf) - posX;
            let wallDistY = posY <= 0 ? 0 - canvHHalf - posY : canvHHalf - posY;

            //Check if already outside of the wall
            if (posX < (0 - canvWHalf)) {
                wallDistX = 10;
                //console.log("X < left edge", wallDistX);
            }
            else if (posX > canvWHalf) {
                wallDistX = 10;
                //console.log("X > right edge", wallDistX);
            }
            if (posY < (0 - canvHHalf)) {
                wallDistY = -10;
            }
            else if (posY > canvHHalf) {
                wallDistY = 10;
                //console.log("Y > upper edge", wallDistY);
            }

            let wallRepX = 0 - Math.pow(wallDistX, -1) * this.WALL_REPULSION_FACTOR;
            let wallRepY = 0 - Math.pow(wallDistY, -1) * this.WALL_REPULSION_FACTOR;


            // Decrease velocity
            this.VELOCITY *= (1 - (this.currentIteration / this.ITERATIONS)/ this.VEOLOCITY_REDUCTION_DAMPING);

            /**
             * Finally calculate V's velocity
             */
            nodeV['velocity'].x = (nodeV['velocity'].x + nodeV['force'].x + wallRepX) * this.VELOCITY;
            nodeV['velocity'].y = (nodeV['velocity'].y + nodeV['force'].y + wallRepY) * this.VELOCITY;


            //console.log(nodeV['velocity']);
        });

        /**
         * Add velocity to position
         */
        this.nodes.forEach((nodeV:NodeAbstract) => {
            let pos = nodeV.getPosition();
            nodeV.setPosition(pos['x'] + nodeV['velocity'].x, pos['y'] + nodeV['velocity'].y);
        });


    }
}

