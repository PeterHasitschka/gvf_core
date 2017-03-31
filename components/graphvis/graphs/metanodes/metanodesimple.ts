import {Plane} from "../../../plane/plane";
import {NodeAbstract} from "../nodes/nodeelementabstract";
import {MetanodeAbstract} from "./metanodeabstract";
export class MetanodeSimple extends MetanodeAbstract {

    constructor(x:number, y:number, nodes:NodeAbstract[], plane:Plane) {
        super(x, y, nodes, plane, {'size': 20});
        this.name = "Meta-Node Simple";
    }
}
