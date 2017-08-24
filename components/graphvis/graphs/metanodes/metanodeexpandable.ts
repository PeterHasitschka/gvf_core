import {MetanodeAbstract} from "./metanodeabstract";
import {NodeAbstract} from "../nodes/nodeelementabstract";
import {Plane} from "../../../plane/plane";
export class MetanodeExpandable extends MetanodeAbstract {

    protected areResNodesCollapsed;

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


    public toggleCollapseResNodes(animated, onFinishCb = null) {
        if (!this.areResNodesCollapsed)
            this.collapseResNodes(false, onFinishCb);
        else
            this.expandResNodes(false, onFinishCb);
    }

    public collapseResNodes(animated, onFinishCb = null) {
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

    public expandResNodes(animated, onFinishCb = null) {
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
        this.plane.getGraphScene().render();
    }

    public onClick() {
        this.toggleCollapseResNodes(false, function () {
        });
        super.onClick();
    }
}
