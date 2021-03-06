import {EdgeAbstract} from "./edges/edgeelementabstract";

/**
 * Interface for all Objects that derive from THREE.Object elements
 */
export interface GraphObject {

    onIntersectStart():void;
    onIntersectLeave():void;
}