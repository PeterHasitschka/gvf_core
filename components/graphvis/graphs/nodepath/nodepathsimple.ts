import {NodeAbstract} from "../nodes/nodeelementabstract";
import {ElementAbstract} from "../graphelementabstract";
import {Plane} from "../../../plane/plane";
import {NodepathAbstract} from "./nodepathabstract";
export class NodepathSimple extends NodepathAbstract {

    protected static lineColor = 0x00FF00;
    protected static lineWidth;
    protected static opacity;

    constructor(nodesToConnect:NodeAbstract[], plane:Plane) {
        super(nodesToConnect, plane, {
            lineColor: NodepathSimple.lineColor,
            lineWidth: NodepathSimple.lineWidth,
            opacity: NodepathSimple.opacity
        });
    }
}