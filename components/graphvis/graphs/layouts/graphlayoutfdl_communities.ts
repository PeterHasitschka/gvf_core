import {GraphLayoutAbstract} from './graphlayoutabstract';
import {Plane} from '../../../plane/plane';
import {EdgeAbstract} from "../edges/edgeelementabstract";
import {NodeAbstract} from "../nodes/nodeelementabstract";
import {GraphLayoutFdl} from "./graphlayoutfdl";

/**
 * Force-Directed-Layout for Graphs
 */
export class GraphLayoutFdlCommunities extends GraphLayoutFdl {

    protected NODE_REPULSION_FACTOR = 50;
    protected EDGE_FORCE_FACTOR = 0.01;
    protected VELOCITY = 1;
    protected WALL_REPULSION_FACTOR = 60;

    constructor(protected plane:Plane, nodes:NodeAbstract[], edges:EdgeAbstract[]) {
        super(plane, nodes, edges);
    }
}


