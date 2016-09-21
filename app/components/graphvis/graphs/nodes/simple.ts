import {NodeAbstract} from './abstract';
import {GraphVisConfig} from '../../config';
import {DataAbstract} from "../../data/abstract";
import {Data} from "@angular/router";

/**
 * A simple node, derived from @see{NodeAbstract}
 * @author Peter Hasitschka
 */
export class NodeSimple extends NodeAbstract {

    constructor(x: number, y: number, protected dataEntity:DataAbstract) {
        super(x, y);
    }

    /**
     * Setting the color of the simple node (e.g. 0xffffff)
     */
    public setColor(color: number): void {
        this.threeMaterial.color.setHex(color);
    }
}