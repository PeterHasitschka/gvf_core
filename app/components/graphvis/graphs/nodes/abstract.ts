import {GraphVisConfig} from '../../config';
import {DataAbstract} from "../../data/abstract";
import {GraphObject} from "../graphobjectinterface";
import {Plane} from "../../../plane/plane";
import {EdgeAbstract} from "../edges/abstract";


/**
 * Abstract class of a Node for the GraphVis
 * Derived from the @see{THREE.Mesh} class.
 * Thus, it holds a geometry and a material
 * @author Peter Hasitschka
 */
export abstract class NodeAbstract extends THREE.Mesh implements GraphObject {

    protected threeMaterial:THREE.MeshBasicMaterial;
    protected threeGeometry:THREE.Geometry;
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
        super(new THREE.CircleGeometry(
            GraphVisConfig.nodes.abstractnode.size,
            GraphVisConfig.nodes.segments), new THREE.MeshBasicMaterial(
            {
                color: GraphVisConfig.nodes.abstractnode.color
            }));

        var config = GraphVisConfig.nodes;

        let color = config.abstractnode.color;
        let highlightColor = config.abstractnode.highlight_color;

        this.plane = plane;
        this.color = color;
        this.highlightColor = highlightColor
        this.threeGeometry = <THREE.Geometry>this.geometry;
        this.threeMaterial = <THREE.MeshBasicMaterial>this.material;
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
     * Returns object containing x,y,z position
     * @returns {Vector3}
     */
    public getPosition():THREE.Vector3 {
        return this.position;
    }

    /**
     * Add an edge to the object.
     * The edge's nodes are NOT affected by this
     * @param edge
     */
    public addEdge(edge:EdgeAbstract) {
        this.edges.push(edge);
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
    public highlightNode() {
        if (this.isHighlighted)
            return;
        this.isHighlighted = true;
        this.threeMaterial.color.setHex(this.highlightColor);
    }

    /**
     * Abstract of De-highlighting a node
     * The defined standard-color is applied
     * No rendering is made
     */
    public deHighlightNode() {
        if (!this.isHighlighted)
            return;
        this.isHighlighted = false;
        this.threeMaterial.color.setHex(this.color);
    }

    /**
     * Callback called when node is intersected the first time (Mouse-Hover)
     */
    public onIntersectStart():void {
        this.highlightNode();
    }

    /**
     * Callback called when node is not intersected anymore (Mouse-Leave)
     */
    public onIntersectLeave():void {
        this.deHighlightNode();
    }
}