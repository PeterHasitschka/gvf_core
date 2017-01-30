import {DataAbstract} from "../../data/dataabstract";
import {Plane} from "../../../plane/plane";
import {GroupAbstract} from "./groupelementabstract";
import {BasicGroup} from "../../data/databasicgroup";
import {NodeSimple} from "../nodes/nodelementsimple";

/**
 * A simple group, derived from @see{GroupAbstract}
 * @author Peter Hasitschka
 */
export class GroupSimple extends GroupAbstract {

    constructor(x:number, y:number, protected dataEntity:BasicGroup, plane:Plane, options:Object) {
        super(x, y, dataEntity, plane, NodeSimple, options);
    }
}