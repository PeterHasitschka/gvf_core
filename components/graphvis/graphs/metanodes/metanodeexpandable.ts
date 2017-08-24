import {MetanodeAbstract} from "./metanodeabstract";
import {NodeAbstract} from "../nodes/nodeelementabstract";
import {Plane} from "../../../plane/plane";
export class MetanodeExpandable extends MetanodeAbstract {

    protected areResNodesCollapsed;

    protected exclusiveOpening = true;

    constructor(x:number, y:number, nodes:NodeAbstract[], plane:Plane, options) {
        let size;
        if (typeof options['size'] !== "undefined" && options['size'])
            size = options['size'];
        else
            size = nodes.length;
        super(x, y, nodes, plane, options);
        this.areResNodesCollapsed = false;
        this.name = "Meta node Expandable";

    }


    public toggleCollapseNodes(animated, onFinishCb = null) {
        if (!this.areResNodesCollapsed)
            this.collapseNodes(false, onFinishCb);
        else
            this.expandNodes(false, onFinishCb);
    }

    public collapseNodes(animated, onFinishCb = null) {

        if (this.areResNodesCollapsed)
            return;

        this.areResNodesCollapsed = true;
        let posX = this.getPosition()['x'];
        let posY = this.getPosition()['y'];

        this.nodes.forEach((n:NodeAbstract) => {
            n.saveOrigPosition(true);
            if (!animated) {
                n.setPosition(posX, posY);
                if (onFinishCb)
                    onFinishCb();
            }
            else {
                console.warn("Animated collapsing of nodes on metanode not implemented yet");
                if (onFinishCb)
                    onFinishCb();
            }
            n.setIsVisible(false);
        });

        this.plane.getGraphScene().render();
    }

    public expandNodes(animated, onFinishCb = null) {

        if (!this.areResNodesCollapsed)
            return;

        this.areResNodesCollapsed = false;

        this.nodes.forEach((n:NodeAbstract) => {
            let origPos = n.getOrigPosition();
            if (!animated) {
                n.setPosition(origPos['x'], origPos['y']);
                if (onFinishCb)
                    onFinishCb();
            }
            else {
                console.warn("Animated expansion of nodes on metanode not implemented yet");
                if (onFinishCb)
                    onFinishCb();
            }
            n.setIsVisible(true);
        });

        if (this.exclusiveOpening) {
            this.plane.getGraphScene().getObjectGroup().children.forEach((o) => {
                if (o.constructor === this.constructor && o.id !== this.id) {
                    (<MetanodeExpandable>o).collapseNodes(false, null);
                }
            });
        }

        this.plane.getGraphScene().render();
    }

    public onClick() {
        this.toggleCollapseNodes(false, function () {
        });
        super.onClick();
    }
}
