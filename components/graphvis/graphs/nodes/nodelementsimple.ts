import {DataAbstract} from "../../data/dataabstract";
import {Plane} from "../../../plane/plane";
import {NodeAbstract} from "./nodeelementabstract";
import {GraphVisConfig} from "../../config";

/**
 * A simple node, derived from @see{NodeAbstract}
 * @author Peter Hasitschka
 */
export class NodeSimple extends NodeAbstract {


    constructor(x:number, y:number, dataEntity:DataAbstract, plane:Plane, options:Object) {
        super(x, y, dataEntity, plane, options);
        if (!GraphVisConfig.graphelements.abstractnode.set_random_z_pos)
            this.setPositionZ(GraphVisConfig.graphelements.abstractnode.z_pos)
    }
}