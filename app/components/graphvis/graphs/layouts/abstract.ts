import {NodeAbstract} from '../nodes/abstract';
import {Plane} from '../../../plane/plane';
import {LayoutInterface} from "./layoutinterface";
import {EdgeAbstract} from "../edges/abstract";

/**
 * Abstract class for different graph layouts (e.g. random graph, FDL-Graph, Special Community-Graphs
 */
export abstract class GraphLayoutAbstract implements LayoutInterface {

    /**
     *
     * @param plane Plane-Instance
     * @param nodes List of nodes
     * @param edges List of edges
     */
    constructor(protected plane:Plane, protected nodes:NodeAbstract[], protected edges:EdgeAbstract[]) {
    }

    /**
     * Called at first to initialize the nodes' positions
     * @param onFinish Callback after finish
     */
    public setInitPositions(onFinish):void {
    }

    /**
     * Calculate the position of the nodes.
     * Since this may happen iteratively (and asynchronous), a callback fct may be necessary to set
     * @param onFinish Callback after finish
     */
    public calculateLayout(onFinish):void {

    }
}