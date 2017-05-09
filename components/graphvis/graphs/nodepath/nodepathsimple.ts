import {NodeAbstract} from "../nodes/nodeelementabstract";
import {ElementAbstract} from "../graphelementabstract";
import {Plane} from "../../../plane/plane";
import {NodepathAbstract} from "./nodepathabstract";
export class NodepathSimple extends NodepathAbstract {

    protected static lineColor1 = 0xFF0000;
    protected static lineColor2 = 0x0000FF;
    protected static lineWidth;
    protected static opacity;

    constructor(nodesToConnect:NodeAbstract[], plane:Plane) {
        super(nodesToConnect, plane, {
            lineColor1: NodepathSimple.lineColor1,
            lineColor2: NodepathSimple.lineColor2,
            lineWidth: NodepathSimple.lineWidth,
            opacity: NodepathSimple.opacity
        });
    }
}