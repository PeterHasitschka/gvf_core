import {ElementAbstract} from "../graphelementabstract";
import {Plane} from "../../../plane/plane";
import {GraphVisConfig} from "../../config";
import {DataAbstract} from "../../data/dataabstract";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../../services/intergraphevents.service";
import {EdgeAbstract} from "../edges/edgeelementabstract";
export abstract class NodeAbstract extends ElementAbstract {


    protected nodeMesh:THREE.Mesh;
    protected distancesToOtherNodes = {};
    protected isCurrentlyInMetaNode = false;
    protected nodeWeight = 0;

    public static IDENTIFIER = "Node Abstract";

    /**
     * Wether the surrounding subgraph can be collapsed and visualized as OnionVis
     * @type {boolean}
     */
    protected aggregateable = true;

    constructor(x:number, y:number, protected dataEntity:DataAbstract, plane:Plane, options:Object) {

        super(x, y, dataEntity, plane, options);
        this.name = NodeAbstract.IDENTIFIER;

        let nodeSize = (options && typeof options['size'] !== "undefined") ? options['size'] : GraphVisConfig.graphelements.abstractnode.size;

        this.nodeMesh = new THREE.Mesh(new THREE.CircleGeometry(
            nodeSize,
            GraphVisConfig.graphelements.abstractnode.segments),
            new THREE.MeshBasicMaterial(
                {
                    color: GraphVisConfig.graphelements.abstractnode.color
                }));

        // For 'real' overlapping
        this.zPos = Math.random() - 0.5;
        this.add(this.nodeMesh);
        //this.nodeMesh['onIntersectStart'] = this.onIntersectStart;
    }


    public setColor(color:number):void {
        super.setColor(color);
        this.nodeMesh.material['color'].setHex(color);
    }

    public select(render = false) {
        this.nodeMesh.material['color'].setHex(this.selectColor);
        super.select(render);
    }

    public deSelect(render = false) {
        this.nodeMesh.material['color'].setHex(this.color);
        super.deSelect(render);
    }

    public highlight(render = false) {
        this.nodeMesh.material['color'].setHex(this.highlightColor);
        // this.edges.forEach((e:EdgeAbstract) => {
        //     e.highlight();
        // });
        super.highlight(render);
    }


    public deHighlight(render = false) {
        if (!this.isSelected)
            this.nodeMesh.material['color'].setHex(this.color);
        else
            this.nodeMesh.material['color'].setHex(this.selectColor);
        // this.edges.forEach((e:EdgeAbstract) => {
        //     e.deHighlight();
        // });
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

    public getIsAggregatable():boolean {
        return this.aggregateable;
    }

    public setADistance(n:NodeAbstract, dist:number) {
        this.distancesToOtherNodes[n.getUniqueId()] = dist;
    }

    public getADistance(n:NodeAbstract) {
        return typeof this.distancesToOtherNodes[n.getUniqueId()] === "undefined" ? null : this.distancesToOtherNodes[n.getUniqueId()];
    }

    public setIsCurrentlyInMetaNode(isInMetanode:boolean) {
        this.isCurrentlyInMetaNode = isInMetanode;
    }

    public getIsCurrentlyInMetaNode():boolean {
        return this.isCurrentlyInMetaNode;
    }

    public setWeight(weight:number) {
        if (isNaN(weight))
            return false;

        this.nodeWeight = weight;
        let scale = 1 + (this.getPlane().getGraph().getMaxNodeWeight() !== 0 ? (weight / this.getPlane().getGraph().getMaxNodeWeight()) : weight);
        this.nodeMesh.scale['set'](scale, scale, scale);
    }

    public getWeight():number {
        return this.nodeWeight;
    }


    public setIsVisible(vis:boolean) {
        this.edges.forEach((e:EdgeAbstract) => {
            e.setIsVisible(vis);
        });
        super.setIsVisible(vis);
    }
}
