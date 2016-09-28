import {NodeAbstract} from "../nodes/abstract";
export interface LayoutInterface {

    setInitPositions(onFinish):void;
    calculateLayout(onFinish):void;
}