import {Plane} from "../../../plane/plane";
import {NodeAbstract} from "../nodes/nodeelementabstract";
import {MetanodeAbstract} from "./metanodeabstract";
export class StarChart extends MetanodeAbstract {

    constructor(x:number, y:number, nodes:NodeAbstract[], plane:Plane) {
        super(x, y, nodes, plane, {'size': 100});
        this.name = "Start Chart Meta-Node";
    }
}
