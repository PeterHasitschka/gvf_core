import {NodeAbstract} from "../nodes/abstract";
export interface LayoutInterface {

    setInitPositions(nodes:NodeAbstract[], onFinish):void;
    calculateLayout(nodes:NodeAbstract[], onFinish):void;
}