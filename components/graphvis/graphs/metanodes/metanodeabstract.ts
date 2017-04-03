import {Plane} from "../../../plane/plane";
import {GraphVisConfig} from "../../config";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../../services/intergraphevents.service";
import {NodeAbstract} from "../nodes/nodeelementabstract";
import {BasicGroup} from "../../data/databasicgroup";
import {ElementAbstract} from "../graphelementabstract";
export abstract class MetanodeAbstract extends ElementAbstract {


    protected meshs = {};

    constructor(x:number, y:number, protected nodes:NodeAbstract[], plane:Plane, options:Object) {

        super(x, y, null, plane, options);
        this.createDataGroupFromNodes();
        this.name = "Meta-Node Abstract";
        this.createMeshs(options);

        for (var meshKey in this.meshs) {
            this.add(this.meshs[meshKey]);
        }

        //this.nodeMeshs
        //this.add(this.nodeMeshs);
        //this.nodeMesh['onIntersectStart'] = this.onIntersectStart;
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
}
