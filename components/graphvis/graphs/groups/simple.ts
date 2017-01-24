import {DataAbstract} from "../../data/abstract";
import {Plane} from "../../../plane/plane";
import {GroupAbstract} from "./abstract";
import {BasicGroup} from "../../data/basicgroup";

/**
 * A simple node, derived from @see{NodeAbstract}
 * @author Peter Hasitschka
 */
export class GroupSimple extends GroupAbstract {

    constructor(x:number, y:number, protected dataEntity:BasicGroup, plane:Plane) {
        super(x, y, dataEntity, plane);
    }
}