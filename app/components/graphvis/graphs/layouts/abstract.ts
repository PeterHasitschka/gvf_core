import {NodeAbstract} from '../nodes/abstract';
import {Plane} from '../../../plane/plane';
import {LayoutInterface} from "./layoutinterface";

export abstract class GraphLayoutAbstract implements LayoutInterface{


    constructor(protected plane: Plane) {
    }


    public setInitPositions(nodes:NodeAbstract[], onFinish):void {
    }


    public calculateLayout(nodes:NodeAbstract[], onFinish):void{

    }
}