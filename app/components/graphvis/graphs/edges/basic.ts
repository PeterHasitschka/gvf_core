import {EdgeAbstract} from "./abstract";
import {Plane} from "../../../plane/plane";
import {NodeAbstract} from "../nodes/abstract";


export class EdgeBasic extends EdgeAbstract {



    constructor(sourceNode:NodeAbstract, destNode:NodeAbstract, plane:Plane)  {
        super(sourceNode, destNode, plane);
    }



}