import {Plane} from "../../../plane/plane";
import {EdgeBasic} from "./edgeelementbasic";
import {NodeAbstract} from "../nodes/nodeelementabstract";

/**
 * A colored edge.
 * Differs from the basic edge, that it further takes a parameter for an initial color
 */
export class EdgeColored extends EdgeBasic {

    protected static opacity = 1.0;

    constructor(sourceNode:NodeAbstract, destNode:NodeAbstract, plane:Plane, color:number, connectionEntity = null, options = null) {
        super(sourceNode, destNode, plane, connectionEntity, options);
        this.setColor(color);
        this.setOpacity(this.constructor['opacity']);
    }
}