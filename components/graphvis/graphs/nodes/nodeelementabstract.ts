import {ElementAbstract} from "../graphelementabstract";
import {Plane} from "../../../plane/plane";
import {GraphVisConfig} from "../../config";
import {DataAbstract} from "../../data/dataabstract";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../../services/intergraphevents.service";
import {EdgeAbstract} from "../edges/edgeelementabstract";
import {ShadowNodeSimple} from "./shadownodesimple";
import {Pie} from "../metanodes/pie";

export enum NODEMESHCREATIONMODES {
    STANDARD_NODE,
    DOUBLE_NODE
}

export abstract class NodeAbstract extends ElementAbstract {


    protected nodeMesh:THREE.Mesh;
    protected distancesToOtherNodes = {};
    protected isCurrentlyInMetaNode = false;
    protected nodeWeight = 0;
    protected ignoreHover;

    protected additionalDoubleMesh:THREE.Mesh;
    protected minSize;
    protected maxSize;
    protected nodeSize;
    protected numSegments;
    protected nodeMeshCreationMode:NODEMESHCREATIONMODES;
    protected additionalMeshSize;
    protected additionalMeshColor;


    /**
     * Are used to point e.g. somewhere without creating another node with the same entity again...
     * Some kind of linked node with the same behaviour than this.
     */
    protected shadowNodes:ShadowNodeSimple[];

    public static IDENTIFIER = "Node Abstract";

    /**
     * Wether the surrounding subgraph can be collapsed and visualized as OnionVis
     * @type {boolean}
     */
    protected aggregateable = true;

    constructor(x:number, y:number, protected dataEntity:DataAbstract, plane:Plane, options:Object) {

        super(x, y, dataEntity, plane, options);
        this.name = NodeAbstract.IDENTIFIER;

        this.nodeSize = (options && typeof options['size'] !== "undefined") ? options['size'] : GraphVisConfig.graphelements.abstractnode.size;
        this.minSize = (options && typeof options['minSize'] !== "undefined") ? options['minSize'] : GraphVisConfig.graphelements.abstractnode.minSize;
        this.maxSize = (options && typeof options['maxSize'] !== "undefined") ? options['maxSize'] : GraphVisConfig.graphelements.abstractnode.maxSize;
        this.additionalMeshSize = (options && typeof options['additionalmeshsize'] !== "undefined") ? options['additionalmeshsize'] : this.nodeSize;
        this.additionalMeshColor = (options && typeof options['additionalmeshcolor'] !== "undefined") ? options['additionalmeshcolor'] : GraphVisConfig.graphelements.abstractnode.additionalmeshcolor;

        this.numSegments = (options && typeof options['segments'] !== "undefined") ? options['segments'] : GraphVisConfig.graphelements.abstractnode.segments;
        this.nodeMeshCreationMode = (options && typeof options['nodemeshcreationmode'] !== "undefined") ? options['nodemeshcreationmode'] : NODEMESHCREATIONMODES.STANDARD_NODE;

        this.createNodeMesh(this.nodeMeshCreationMode);
        //this.nodeMesh['onIntersectStart'] = this.onIntersectStart;
        this.shadowNodes = [];
        this.ignoreHover = false;
    }

    protected createNodeMesh(mode:NODEMESHCREATIONMODES) {

        // For 'real' overlapping
        this.zPos = Math.random() - 0.5;

        switch (mode) {
            case NODEMESHCREATIONMODES.STANDARD_NODE :
                this.nodeMesh = new THREE.Mesh(new THREE.CircleGeometry(
                    this.nodeSize, this.numSegments
                    ),
                    new THREE.MeshBasicMaterial(
                        {
                            color: GraphVisConfig.graphelements.abstractnode.color
                        }));
                break;

            case NODEMESHCREATIONMODES.DOUBLE_NODE :

                this.nodeMesh = new Pie(Math.PI / 2, Math.PI * 1.5, this.nodeSize, GraphVisConfig.graphelements.abstractnode.color, 0);
                this.additionalDoubleMesh = new Pie(Math.PI * 1.5, Math.PI / 2, this.additionalMeshSize, this.additionalMeshColor, 0);
                this.add(this.additionalDoubleMesh);
                break;

            default:
                console.warn("NODE MASH CREATION MODE NOT AVAILABLE!");
        }


        this.add(this.nodeMesh);
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

        // this.shadowNodes.forEach((sn:ShadowNodeSimple) => {
        //     sn.highlight(render);
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


        // this.shadowNodes.forEach((sn:ShadowNodeSimple) => {
        //     sn.deHighlight(render);
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
        let maxNodeWeight = this.getPlane().getGraph().getMaxWeight(this.constructor.name);

        if (weight > maxNodeWeight) {
            this.getPlane().getGraph().setMaxWeight(this.constructor.name, weight);
            maxNodeWeight = weight;
        }

        // let scale = 1.0 + (weight / maxNodeWeight) * 5;
        let scale = (weight / maxNodeWeight) * (this.maxSize - this.minSize) + this.minSize;

        // Take init node size into account
        scale /= this.nodeSize;

        this.nodeMesh.scale['set'](scale, scale, scale);
    }

    public getWeight():number {
        return this.nodeWeight;
    }


    public setIsVisible(vis:boolean) {

        // this.shadowNodes.forEach((sn:ShadowNodeSimple) => {
        //     sn.setIsVisible(vis);
        // });
        this.edges.forEach((e:EdgeAbstract) => {
            // Only show if other connected node is also visible
            if (vis) {
                let otherNode:NodeAbstract = null;
                if (e.getSourceNode() === this)
                    otherNode = e.getDestNode();
                else
                    otherNode = e.getSourceNode();

                if (otherNode.getIsVisible())
                    e.setIsVisible(vis);
            }
            else
                e.setIsVisible(vis);
        });


        super.setIsVisible(vis);
    }


    public addShadowNode(sn:ShadowNodeSimple) {
        this.shadowNodes.push(sn);
    }

    public removeShadowNode(sn:ShadowNodeSimple) {
        let BreakException = {};
        try {
            this.shadowNodes.forEach((s_, k) => {
                if (s_.getUniqueId() === sn.getUniqueId()) {
                    this.shadowNodes = this.shadowNodes.splice(k, 1);
                    throw BreakException;
                }
            });

        } catch (e) {
            if (e !== BreakException)
                throw e;
        }
    }

    public getShadowNodes():ShadowNodeSimple[] {
        return this.shadowNodes;
    }

    public setIgnoreHover(val:boolean) {
        this.ignoreHover = val;
    }
}
