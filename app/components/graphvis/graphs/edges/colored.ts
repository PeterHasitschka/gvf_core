import {Plane} from "../../../plane/plane";
import {EdgeBasic} from "./basic";
import {NodeAbstract} from "../nodes/abstract";


export class EdgeColored extends EdgeBasic {
    constructor(sourceNode:NodeAbstract, destNode:NodeAbstract, plane:Plane, color:number) {
        super(sourceNode, destNode, plane);
        this.setColor(color);
    }
}