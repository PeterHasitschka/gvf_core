import {DataAbstract} from "../../data/dataabstract";
import {Plane} from "../../../plane/plane";
import {GroupAbstract} from "./groupelementabstract";
import {BasicGroup} from "../../data/databasicgroup";

/**
 * A simple node, derived from @see{NodeAbstract}
 * @author Peter Hasitschka
 */
export class GroupSimple extends GroupAbstract {

    constructor(x:number, y:number, protected dataEntity:BasicGroup, plane:Plane) {
        super(x, y, dataEntity, plane);
    }
}