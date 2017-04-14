import {Component} from '@angular/core';
import {GraphScene} from '../graphvis/scene';
import {GraphVisConfig} from '../graphvis/config';
import {GraphAbstract} from '../graphvis/graphs/graphabstract';
import {UiService} from "../../services/ui.service";
import {SelectionPolygon} from "../graphvis/graphs/polygonselection/polygon";
import {ElementAbstract} from "../graphvis/graphs/graphelementabstract";
import {NodeAbstract} from "../graphvis/graphs/nodes/nodeelementabstract";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../services/intergraphevents.service";
import {OnionVis} from "../graphvis/graphs/metanodes/onionvis/onionvis";

/**
 * The Plane Object holds the @see{GraphScene} element and connects to the
 * HTML element.
 * It gets initialized by its component @see{PlaneComponent}.
 * The @see{GraphScene} gets created and the graph, defined in the
 * constructor's parameter is built.
 * Finally the graph's init() method is called.
 */
export class Plane {

    private containerId:number;
    private scene:GraphScene;
    static containerPrefix:string = "graphvisplanecontainercontent";
    private static planes:Plane[] = [];
    private graph:GraphAbstract;
    private canvasDimensions;
    private backplaneMesh:THREE.Mesh;
    private selectedElement:ElementAbstract;

    private isMinimized = false;

    private polygonSelection:SelectionPolygon;


    /**
     * @param{string} name - Defining the graph's name
     * @param{string} graphtype
     */
    constructor(private name:string, private graphclass, public uiService:UiService, private dataGetterFct = null) {
        Plane.planes.push(this);
    }

    /**
     * Called after making sure the container exists
     * @param{number} containerId - An Id that gets combined with the containerPrefix
     * to get the (existing) element for storing the scene in it.
     *
     * At first the @see{GraphScene} gets created.
     * Then the @see{GraphAbstract} derivation.
     * Finally the graph's init method is called
     */
    public initScene(containerId:number) {


        /**
         * Determine HTML container
         */
        this.containerId = containerId;
        this.calculateCanvasSize();
        var container = document.getElementById(Plane.containerPrefix + this.containerId);

        /**
         * Create THREE.js Scene within GraphScene Container
         */
        this.scene = new GraphScene(container, this);
        this.createBackPlane();


        /**
         * Create Graph, depending on graphtype-string
         */

        //this.graph = new GraphVisConfig.active_graphs[this.graphtype](this);
        this.graph = new this.graphclass(this);

        if (this.dataGetterFct)
            this.graph.setDataGetterMethod(this.dataGetterFct);


        // try {
        // } catch (e) {
        //
        //     console.error("Could not create graph of type '" + this.graphtype + "'!", e);
        // }
        // Load Data from DataService and build the graph
        this.graph.init();

        this.polygonSelection = new SelectionPolygon(this);
        this.getGraphScene().addObject(this.polygonSelection);

        /**
         * Handle empty click in this plane (e.g. deselect selected)
         */
        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.EMPTY_SPACE_IN_PLANE_CLICKED, function (d) {
            if (this !== d.detail.plane)
                return;

            if (this.selectedElement)
                this.selectedElement.deSelect(true);

        }.bind(this));
    }


    public onMouseDown(x, y, ctrl) {
        if (!this.polygonSelection.getActivated() && ctrl)
            this.polygonSelection.startSelecting();

        if (this.polygonSelection.getActivated() && !ctrl)
            this.polygonSelection.stopSelecting();

        if (!this.polygonSelection.getActivated())
            return;

        this.polygonSelection.addDot(x, y);
    }


    public onClick(x, y, ctrl) {


    }


    /**
     * Calculating the width and height of the defined container
     */
    public calculateCanvasSize() {
        var container = document.getElementById(Plane.containerPrefix + this.containerId);
        this.canvasDimensions = {x: container.clientWidth - 0, y: container.clientHeight};
    }

    public getCanvasSize():Object {
        return this.canvasDimensions;
    }

    /**
     * Creating a plane behind all graphelements. Useful when rotating etc.
     */
    private createBackPlane() {
        let config = GraphVisConfig.scene.backplane;
        this.setBackgroundColor(config.color);
    }

    private dummyRotate(object, axis, radians) {
        var rotationMatrix = new THREE.Matrix4();

        rotationMatrix.makeRotationAxis(axis.normalize(), radians);
        rotationMatrix.multiply(object.matrix);                       // pre-multiply
        object.matrix = rotationMatrix;
        object.rotation.setFromRotationMatrix(object.matrix);

    }


    public getName():string {
        return this.name;
    }

    public getContainerPrefix():string {
        return Plane.containerPrefix;
    }

    public getId():number {
        return this.containerId;
    }

    public getGraphScene():GraphScene {
        // if (!this.scene)
        //     console.error("Could not get Graph Scene - Not initialized yet?");
        return this.scene;
    }

    public getGraph():GraphAbstract {
        return this.graph;
    }


    public getGraphClass():Function {
        return this.graphclass;
    }

    public getPolygonSelection() {
        return this.polygonSelection;
    }

    public setBackgroundColor(color:string) {
        //this.backplaneMesh.material['color'].setHex(color);
        document.getElementById(Plane.containerPrefix + this.containerId).style.setProperty("background", color);
    }

    public close() {
        console.warn("Closing plane - Not implemented yet");
    }

    public minimize() {
        this.isMinimized = true;
        this.uiService.setPlaneMinimized(this);
    }

    public maximize() {
        this.restore();
        let planeHtml = document.getElementById(Plane.containerPrefix + this.containerId).parentElement.parentElement;
        planeHtml.style.width = planeHtml.parentElement.parentElement.parentElement.clientWidth.toString();
        planeHtml.style.height = planeHtml.parentElement.parentElement.parentElement.clientHeight.toString();
        this.calculateCanvasSize();
        this.getGraphScene().setSizeToPlane();
    }


    public restore() {
        this.isMinimized = false;
        this.uiService.setPlaneRestored(this);
        window.setTimeout(0, function () {
            this.calculateCanvasSize();
            this.getGraphScene().setSizeToPlane();
            this.getGraphScene().render();
        }.bind(this));
    }

    public getIsMinimized() {
        return this.isMinimized;
    }

    public static getPlanes():Plane[] {
        return Plane.planes;
    }

    public getSelectedGraphElement():ElementAbstract {
        return this.selectedElement;
    }

    public setSelectedGraphElement(elm:ElementAbstract) {
        if (this.selectedElement)
            this.selectedElement.deSelect(true);
        this.selectedElement = elm;
    }

    public isSelectedElementDeletable():boolean {
        if (!this.selectedElement)
            return false;
        return this.selectedElement.isDeletableByUser();
    }

    public deleteSelectedElement() {
        if (this.selectedElement)
            this.selectedElement.delete();
        this.setSelectedGraphElement(null);
    }

    public isSelectedElementAggregateable():boolean {
        if (!this.selectedElement || !(this.selectedElement instanceof NodeAbstract))
            return false;
        return (<NodeAbstract>this.selectedElement).getIsAggregatable();
    }

    public createCollapsedAggregationOnNode() {
        if (!this.isSelectedElementAggregateable())
            return;

        let pos = this.selectedElement.getPosition();
        let onion = new OnionVis(pos.x, pos.y, <NodeAbstract>this.selectedElement, this);
        this.getGraphScene().addObject(onion);
        this.getGraphScene().render();
    }

    public getDebugRenderingStatistics() {
        return {
            renderingIntervals: (this.getGraphScene() && this.getGraphScene().getThreeRenderer()) ?
                this.getGraphScene().getThreeRenderer().getNumRenderingsAvgPerSecond() : null
        }
    }

    public getDebugClickStatistics() {
        if (this.getGraphScene() && this.getGraphScene().getSceneMouseInteractions()) {
            return {
                clicked: this.getGraphScene().getSceneMouseInteractions().debug.click,
                hovered: this.getGraphScene().getSceneMouseInteractions().debug.hover,
                numIntersected: this.getGraphScene().getSceneMouseInteractions().debug.numIntersected
            };
        } else return [];
    }
}