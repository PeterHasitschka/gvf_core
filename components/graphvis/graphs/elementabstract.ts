import {GraphVisConfig} from '../config';
import {DataAbstract} from "../data/abstract";
import {GraphObject} from "./graphobjectinterface";
import {Plane} from "../../plane/plane";
import {EdgeAbstract} from "./edges/abstract";
import {WORKER_UI_STARTABLE_MESSAGING_SERVICE} from "@angular/platform-browser";
import {UiService} from "../../../services/ui.service";


/**
 * Abstract class of a Node or Group for the GraphVis
 * Derived from the @see{THREE.Mesh} class.
 * Thus, it holds a geometry and a material
 * @author Peter Hasitschka
 */
export abstract class ElementAbstract extends THREE.Group implements GraphObject {


    protected zPos;
    protected color:number;
    protected isHighlighted = false;
    protected highlightColor:number;
    protected plane:Plane;

    protected dataEntity:DataAbstract;
    protected edges = [];


    /**
     * Constructor of the abstract node
     * @param x X-Position on the Plane
     * @param y Y-Position on the Plane
     * @param plane Plane Instance
     */
    constructor(x:number, y:number, plane:Plane) {

        /**
         * SUPER call must be first statement, thus extract geometry and material afterwards
         */

        super();
        this.name = "GVF Element Group";

        var config = GraphVisConfig.graphelements;

        let color = config.abstractnode.color;
        let highlightColor = config.abstractnode.highlight_color;

        this.plane = plane;
        this.color = color;
        this.highlightColor = highlightColor;
        this.zPos = config.abstractnode.z_pos;


        x = x === undefined ? 0.0 : x;
        y = y === undefined ? 0.0 : y;

        this.setPosition(x, y);
    }

    /**
     * Set the position of the node.
     * Edges are getting updated automatically.
     * NO Render-Call is made
     * @param x
     * @param y
     */
    public setPosition(x:number, y:number):void {
        this.position.setX(x);
        this.position.setY(y);
        this.edges.forEach((edge:EdgeAbstract) => {
            edge.updatePositions();
        });
    }

    /**
     * Setting the color of the simple node (e.g. 0xffffff)
     */
    public setColor(color:number):void {
    }

    /**
     * Returns object containing x,y,z position
     * @returns {Vector3}
     */
    public getPosition():THREE.Vector3 {
        return this.position;
    }

    /**
     * Add an edge to the object.
     * The edge's graphElements are NOT affected by this
     * @param edge
     */
    public addEdge(edge:EdgeAbstract) {
        this.edges.push(edge);
    }

    /**
     * Get All Edges
     * @returns {Array}
     */
    public getEdges():EdgeAbstract[] {
        return this.edges;
    }

    /**
     * Return the node's data
     * @returns {DataAbstract}
     */
    public getDataEntity():DataAbstract {
        return this.dataEntity;
    }

    /**
     * Abstract of highlighting a node
     * The defined highlight-color is applied
     * No rendering is made
     */
    public highlight() {
        if (this.isHighlighted)
            return;
        this.isHighlighted = true;
    }

    /**
     * Abstract of De-highlighting a node
     * The defined standard-color is applied
     * No rendering is made
     */
    public deHighlight() {
        if (!this.isHighlighted)
            return;
        this.isHighlighted = false;
    }

    /**
     * Callback called when node is intersected the first time (Mouse-Hover)
     */
    public onIntersectStart():void {
        this.highlight();
    }

    /**
     * Callback called when node is not intersected anymore (Mouse-Leave)
     */
    public onIntersectLeave():void {
        this.deHighlight();
    }

    /**
     * Calculate and return the distance to another node
     * @param nodeU Node to compare
     * @param dimension Optional: null or undefined => Squared distance, 'x' => X-Distance, 'y' => Y-Distance
     *
     */
    public getDistance(nodeU:ElementAbstract, dimension?:string):number {
        let posVX = this.getPosition()['x'];
        let posVY = this.getPosition()['y'];
        let posUX = nodeU.getPosition()['x'];
        let posUY = nodeU.getPosition()['y'];

        if (dimension === 'x')
            return posVX - posUX;
        if (dimension === 'y')
            return posVY - posUY;
        return Math.pow((posVX - posUX), 2) + Math.pow((posVY - posUY), 2);
    }

    /**
     * Calculate the global position on the graph-Workspace
     * Used for Inter-Graph-Connections
     */
    public getWorkspacePosition() {

        let pos = this.getPosition();

        let canvas = this.plane.getGraphScene().getThreeRenderer().domElement;
        let canvasBounding = canvas.getBoundingClientRect();
        let workspace = UiService.getInstance().getGraphWorkSpaceSvgElement();
        let workspaceBounding = workspace.getBoundingClientRect();

        let x = pos['x'] + canvasBounding.left - workspaceBounding.left + canvasBounding.width / 2;
        let y = -pos['y'] + canvasBounding.top - workspaceBounding.top + canvasBounding.height / 2;

        return ({x: x, y: y});
    }
}