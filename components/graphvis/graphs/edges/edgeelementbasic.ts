import {EdgeAbstract} from "./edgeelementabstract";
import {Plane} from "../../../plane/plane";
import {NodeAbstract} from "../nodes/nodeelementabstract";


/**
 * Basic Edge class, Derived from @see{EdgeAbstract}
 */
export class EdgeBasic extends EdgeAbstract {


    constructor(sourceNode:NodeAbstract, destNode:NodeAbstract, plane:Plane, connectionEntity = null, options = null) {
        super(sourceNode, destNode, plane, connectionEntity, options);
    }


}