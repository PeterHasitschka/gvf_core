import {Plane} from "../../../plane/plane";
import {EdgeBasic} from "./basic";


export class EdgeColored extends EdgeBasic {
    constructor(startx:number, starty:number, endx:number, endy:number, plane:Plane, color:number) {
        super(startx, starty, endx, endy, plane);
        this.setColor(color);
    }
}