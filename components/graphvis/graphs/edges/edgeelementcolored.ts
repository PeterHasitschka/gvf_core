import {Plane} from "../../../plane/plane";
import {EdgeBasic} from "./edgeelementbasic";
import {NodeAbstract} from "../nodes/nodeelementabstract";

/**
 * A colored edge.
 * Differs from the basic edge, that it further takes a parameter for an initial color
 */
export class EdgeColored extends EdgeBasic {
    constructor(sourceNode:NodeAbstract, destNode:NodeAbstract, plane:Plane, color:number) {
        super(sourceNode, destNode, plane);
        this.setColor(color);
    }
}