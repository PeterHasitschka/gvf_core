import {MetanodeAbstract} from "./metanodeabstract";
import {NodeAbstract} from "../nodes/nodeelementabstract";
import {Plane} from "../../../plane/plane";
import {AnimationService} from "../../../../services/animationservice";
export class MetanodeExpandable extends MetanodeAbstract {

    protected areResNodesCollapsed;

    protected exclusiveOpening;

    protected expandAutoAnimated;

    constructor(x:number, y:number, nodes:NodeAbstract[], plane:Plane, options) {
        let size;
        if (typeof options['size'] !== "undefined" && options['size'])
            size = options['size'];
        else
            size = nodes.length;
        super(x, y, nodes, plane, options);
        this.exclusiveOpening = true;
        this.areResNodesCollapsed = false;
        this.expandAutoAnimated = false;
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

        if (!animated) {
            this.nodes.forEach((n:NodeAbstract) => {
                n.saveOrigPosition(true);
                n.setPosition(posX, posY);
                if (onFinishCb)
                    onFinishCb();
                n.setIsVisible(false);
            });
        }
        else {
            this.nodes.forEach((n:NodeAbstract) => {
                n.setIsVisible(false);
            });
            AnimationService.getInstance().collapseNodes(this.nodes, this.plane, this.getCenterPos(), onFinishCb);
        }

        this.plane.getGraphScene().render();
    }

    public expandNodes(animated, onFinishCb = null) {

        if (!this.areResNodesCollapsed)
            return;

        this.areResNodesCollapsed = false;


        if (!animated) {
            this.nodes.forEach((n:NodeAbstract) => {
                let origPos = n.getOrigPosition();

                n.setPosition(origPos['x'], origPos['y']);
                if (onFinishCb)
                    onFinishCb();
                n.setIsVisible(true);
            });
        }
        else {
            this.nodes.forEach((n:NodeAbstract) => {
                n.setIsVisible(true);
            });
            console.log(onFinishCb);
            AnimationService.getInstance().restoreNodeOriginalPositions(this.nodes, this.plane, onFinishCb);
        }

        if (this.exclusiveOpening) {
            this.plane.getGraphScene().getObjectGroup().children.forEach((o) => {
                if (o.constructor === this.constructor && o.id !== this.id) {
                    (<MetanodeExpandable>o).collapseNodes(false, null);
                }
            });
        }

        this.plane.getGraphScene().render();
    }


    // public select(render = false) {
    //     this.expandNodes(this.expandAutoAnimated, function(){
    //
    //     });
    //     super.select(render);
    // }
    // public deSelect(render = false) {
    //     this.collapseNodes(this.expandAutoAnimated, function(){
    //
    //     });
    //     super.deSelect(render);
    // }

    public onClick() {
        this.toggleCollapseNodes(false, function () {
        });
        super.onClick();
    }

}
