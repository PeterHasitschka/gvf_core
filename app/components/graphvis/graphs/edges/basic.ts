import {EdgeAbstract} from "./abstract";
import {Plane} from "../../../plane/plane";


export class EdgeBasic extends EdgeAbstract {


    constructor(startx:number, starty:number, endx:number, endy:number, plane:Plane) {
        super(startx, starty, endx, endy, plane)
        ;
    }
}