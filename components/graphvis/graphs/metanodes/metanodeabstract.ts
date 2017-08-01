import {Plane} from "../../../plane/plane";
import {GraphVisConfig} from "../../config";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../../services/intergraphevents.service";
import {NodeAbstract} from "../nodes/nodeelementabstract";
import {BasicGroup} from "../../data/databasicgroup";
import {ElementAbstract} from "../graphelementabstract";
import {Label} from "../labels/label";
import {AnimationService} from "../../../../services/animationservice";
export abstract class MetanodeAbstract extends ElementAbstract {


    protected meshs = {};
    protected labels = [];
    protected metanodeOptions = {};


    constructor(x:number, y:number, protected nodes:NodeAbstract[], plane:Plane, options:Object) {

        super(x, y, null, plane, options);
        this.metanodeOptions = options;
        this.createDataGroupFromNodes();
        this.name = "Meta-Node Abstract";

        this.nodes.forEach((n:NodeAbstract) => {
            n.setIsCurrentlyInMetaNode(true);
        });
        this.isdeletablebyuser = true;
    }

    protected zoomAndCenter() {
        let zoomGoal = GraphVisConfig.graphelements.metanode.zoom;
        let center = this.getCenterPos();

        this.plane.getGraphScene().moveCameraAnimated(center);
        this.plane.getGraphScene().zoomCameraAnimated(zoomGoal);

    }

    protected createMeshs(options) {

        let nodeSize = (options && typeof options['size'] !== "undefined") ? options['size'] : GraphVisConfig.graphelements.abstractnode.size;

        let nodeMesh = new THREE.Mesh(new THREE.CircleGeometry(
            nodeSize,
            GraphVisConfig.graphelements.abstractnode.segments),
            new THREE.MeshBasicMaterial(
                {
                    color: GraphVisConfig.graphelements.abstractnode.color
                }));

        this.meshs['basenode'] = nodeMesh;
    }


    /**
     * The Metanode is created by nodes and not a data-group or list of entities.
     * Create it after constructing to fulfill separation between graphical and logical representation.
     */
    protected createDataGroupFromNodes() {

        let entities = [];

        this.nodes.forEach((n:NodeAbstract) => {
            entities.push(n.getDataEntity());
        });

        let group = new BasicGroup(BasicGroup.getDataList().length, entities, {});
        this.setDataEntity(group);
    }

    public setColor(color:number):void {
        super.setColor(color);
        if (this.meshs['basenode'])
            this.meshs['basenode'].material['color'].setHex(color);
    }


    public highlight(render = false) {
        if (this.meshs['basenode'])
            this.meshs['basenode'].material['color'].setHex(this.highlightColor);
        super.highlight(render);
    }


    public deHighlight(render = false) {
        if (this.meshs['basenode'])
            this.meshs['basenode'].material['color'].setHex(this.color);
        super.deHighlight(render);
    }


    /**
     * On Mouse-Hover
     * Sending an Event for notifying that node was intersected
     */
    public onIntersectStart():void {
        super.onIntersectStart();
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.NODE_HOVERED, this);
        //this.plane.getGraphScene().render();
    }

    /**
     * On Mouse-Leave
     * Sending an Event for notifying that node was left
     */
    public onIntersectLeave():void {
        super.onIntersectLeave();
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.NODE_LEFT, this);
        //this.plane.getGraphScene().render();
    }

    public onClick():void {
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.NODE_CLICKED, this);
        this.select(true);
    }

    public delete(cb = null, restoreNodePositions = true):void {
        for (var meshKey in this.meshs) {
            this.remove(this.meshs[meshKey]);
        }

        this.labels.forEach((l:Label) => {
            this.remove(l);
            l.delete();
        });
        if (restoreNodePositions) {
            AnimationService.getInstance().finishAllAnimations();
            AnimationService.getInstance().restoreNodeOriginalPositions(this.nodes, this.plane, cb);
        } else if (cb)
            cb();

        this.nodes.forEach((n:NodeAbstract) => {
            if (n === null)
                return;

            n.setIsCurrentlyInMetaNode(false);
            n.deHighlight(false);
        });

        super.delete();
    }


    public showLabels() {
        this.labels.forEach((l:Label) => {
            l.show();
        })
    }


    protected getCenterPos() {
        return this.getPosition();
    }
}
