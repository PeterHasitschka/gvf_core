import {NodeAbstract} from '../nodes/abstract';
import {Plane} from '../../../plane/plane';
import {LayoutInterface} from "./layoutinterface";
import {EdgeAbstract} from "../edges/abstract";

export abstract class GraphLayoutAbstract implements LayoutInterface {


    constructor(protected plane:Plane, protected nodes:NodeAbstract[], protected edges:EdgeAbstract[]) {
    }


    public setInitPositions(onFinish):void {
    }


    public calculateLayout(onFinish):void {

    }
}