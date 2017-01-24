import {DataAbstract} from "../../data/abstract";
import {Plane} from "../../../plane/plane";
import {NodeAbstract} from "./nodeabstract";

/**
 * A simple node, derived from @see{NodeAbstract}
 * @author Peter Hasitschka
 */
export class NodeSimple extends NodeAbstract {

    constructor(x:number, y:number, dataEntity:DataAbstract, plane:Plane) {
        super(x, y, dataEntity, plane);
    }
}