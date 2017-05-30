import {GraphVisConfig} from '../config';
import {DataAbstract} from "../data/dataabstract";
import {GraphObject} from "./graphobjectinterface";
import {Plane} from "../../plane/plane";
import {EdgeAbstract} from "./edges/edgeelementabstract";
import {WORKER_UI_STARTABLE_MESSAGING_SERVICE} from "@angular/platform-browser";
import {UiService} from "../../../services/ui.service";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../services/intergraphevents.service";
import {HelperService} from "../../../services/helper.service";
import {Label} from "./labels/label";


export enum GRAPH_ELEMENT_LABEL_TYPE {
    NONE,
    TEXT,
    ICON
}

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
    protected isSelected = false;
    protected highlightColor:number;
    protected selectColor:number;
    protected isdeletablebyuser = false;
    protected plane:Plane;
    protected origPos = null;

    protected options = {};
    protected edges = [];
    protected uniqueId:number;

    protected labelType:GRAPH_ELEMENT_LABEL_TYPE = GRAPH_ELEMENT_LABEL_TYPE.NONE;
    protected label:THREE.Object3D;
    protected labelText:string = "";
    protected labelTextColor:string = "black";
    protected labelTextSize:number = 10;
    protected labelIconPath:string = "/gvfcore/assets/icons/x.png";
    protected labelIconSize:number = 20;
    protected labelZoomLevelMin = 1.5;
    protected labelZoomAdjustmentBlocked = false;

    protected hoverBox:Label = null;
    protected hoverText = null;
    protected hoverTextFontSize = 14;
    protected hoverTextColor = "black";

    protected static idCounter = 0;

    public static IDENTIFIER = "GVF Element";

    /**
     * Constructor of the abstract node
     * @param x X-Position on the Plane
     * @param y Y-Position on the Plane
     * @param dataEntity DateAbstract element holding the data
     * @param plane Plane Instance
     * @param options Object holding various options
     */
    constructor(x:number, y:number, protected dataEntity:DataAbstract, plane:Plane, options:Object) {

        /**
         * SUPER call must be first statement, thus extract geometry and material afterwards
         */
        super();

        if (typeof options !== "undefined" && options !== null)
            this.options = options;


        this.name = ElementAbstract.IDENTIFIER;

        var config = GraphVisConfig.graphelements;

        let color = config.abstractnode.color;
        let highlightColor = config.abstractnode.highlight_color;
        let selectColor = config.abstractnode.select_color;

        this.plane = plane;
        this.color = color;
        this.highlightColor = highlightColor;
        this.selectColor = selectColor;
        this.zPos = config.abstractnode.z_pos;


        x = x === undefined ? 0.0 : x;
        y = y === undefined ? 0.0 : y;

        this.setPosition(x, y);
        if (this.dataEntity)
            this.dataEntity.registerGraphElement(this);


        this.uniqueId = ElementAbstract.idCounter;
        ElementAbstract.idCounter++;


    }

    protected createLabel() {

        switch (this.labelType) {

            case GRAPH_ELEMENT_LABEL_TYPE.NONE :
                this.label = null;
                break;


            case GRAPH_ELEMENT_LABEL_TYPE.ICON:
                this.label = null;

                if (!this.labelIconPath) {
                    console.warn("No Icon set for node", this);
                    return;
                }

                var textureLoader = new THREE.TextureLoader();
                textureLoader.load(this.labelIconPath, function (texture) {
                    //texture.minFilter = THREE.LinearFilter;
                    let iconCircle = new THREE.Mesh(new THREE.CircleGeometry(
                        this.labelIconSize,
                        GraphVisConfig.graphelements.abstractnode.segments),
                        new THREE.MeshBasicMaterial({
                            map: texture,
                            side: THREE.DoubleSide,
                            transparent: true,
                            color: 0xFFFFFF,
                            visible: true,
                        }));

                    //texture.flipY = true;
                    this.label = iconCircle;
                    this.label.position.set(0, 0, 0);
                    this.add(this.label);
                }.bind(this));
                break;


            case GRAPH_ELEMENT_LABEL_TYPE.TEXT :
                this.label = null;

                let label = new Label(this.plane, this.labelText, 0, 0, {
                    color: this.labelTextColor,
                    fontSize: this.labelTextSize,
                    strokeColor: null
                });


                this.label = label;
                this.add(this.label);
                break;
        }


    }

    /**
     * Create Hoverbox on the fly (on first hover)
     */
    protected createHoverBox() {
        this.hoverBox = new Label(this.getPlane(), this.hoverText ? this.hoverText : "", 0, -12, {
            color: this.hoverTextColor,
            fontSize: this.hoverTextFontSize,
            strokeColor: null,
            hidden: true,
            zval: 20
        });
        this.add(this.hoverBox);
    }


    public getUniqueId():number {
        return this.uniqueId;
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
        this.position.setZ(this.zPos);
        this.edges.forEach((edge:EdgeAbstract) => {
            edge.updatePositions();
        });
    }

    public saveOrigPosition(overwrite = false) {
        if (this.origPos === null || overwrite)
            this.origPos = this.position.clone();
    }

    public getOrigPosition() {
        return this.origPos ? this.origPos : this.position;
    }

    /**
     * Setting the color of the simple node (e.g. 0xffffff)
     */
    public setColor(color:number):void {
    }

    public getColor():number {
        return this.color;
    }

    /**
     * Returns object containing x,y,z position
     * @returns {Vector3}
     */
    public getPosition():THREE.Vector3 {

        return this.position;
    }

    public getPosition2DForAnimation() {
        return {'x': this.position.x, 'y': this.position.y};
    }

    public setPosition2DForAnimation(pos) {
        this.setPosition(pos.x, pos.y);
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


    protected setDataEntity(dataEntity:DataAbstract) {
        this.dataEntity = dataEntity;
    }

    /**
     * Return the node's data
     * @returns {DataAbstract}
     */
    public getDataEntity():DataAbstract {
        return this.dataEntity;
    }

    /**
     * Abstract of SELECTING a node
     * The defined highlight-color is applied
     */
    public select(render:boolean = false) {
        if (this.isSelected)
            return;
        this.isSelected = true;
        if (render)
            this.plane.getGraphScene().render();

        this.plane.setSelectedGraphElement(this);
    }

    /**
     * Abstract of De-SELECTING a node
     * The defined standard-color is applied
     */
    public deSelect(render:boolean = true) {
        if (!this.isSelected)
            return;
        this.isSelected = false;

        if (this.plane.getSelectedGraphElement() === this)
            this.plane.setSelectedGraphElement(null);

        if (render)
            this.plane.getGraphScene().render();
    }

    /**
     * Abstract of highlighting a node
     * The defined highlight-color is applied
     * No rendering is made
     */
    public highlight(render:boolean = false) {
        if (this.getOptionValue("skip_highlighting_on_hover") === false)
            return;

        if (this.isHighlighted)
            return;
        this.isHighlighted = true;
        if (render)
            this.plane.getGraphScene().render();
    }

    /**
     * Abstract of De-highlighting a node
     * The defined standard-color is applied
     * No rendering is made
     */
    public deHighlight(render:boolean = false) {
        if (this.getOptionValue("skip_highlighting_on_hover") === false)
            return;

        if (!this.isHighlighted)
            return;
        this.isHighlighted = false;
        if (render)
            this.plane.getGraphScene().render();
    }

    /**
     * On Mouse-Hover
     * Sending an Event for notifying that node was intersected
     */
    public onIntersectStart():void {
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.ELEMENT_HOVERED, this);

        if (!this.hoverBox)
            this.createHoverBox();
        this.hoverBox.show();
        this.highlight(true);
    }

    /**
     * On Mouse-Leave
     * Sending an Event for notifying that node was left
     */
    public onIntersectLeave():void {
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.ELEMENT_LEFT, this);
        this.hoverBox.hide();
        this.deHighlight(true);
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

        let pos = this.getPosition().clone();

        let parentPos = this.parent.position;
        pos = pos.add(parentPos);
        pos.sub(this.plane.getGraphScene().getThreeCamera().position);

        let canvas = this.plane.getGraphScene().getThreeRenderer().domElement;
        let canvasBounding = canvas.getBoundingClientRect();
        let workspace = UiService.getInstance().getGraphWorkSpaceSvgElement();
        let workspaceBounding = workspace.getBoundingClientRect();

        let zoom = this.plane.getGraphScene().getThreeCamera()['zoom'];
        let x = pos['x'] * zoom + canvasBounding.left - workspaceBounding.left + canvasBounding.width / 2;
        let y = -pos['y'] * zoom + canvasBounding.top - workspaceBounding.top + canvasBounding.height / 2;

        return ({x: x, y: y});
    }


    protected getOptionValue(key:string) {
        if (typeof this.options[key] === "undefined")
            return null;
        return this.options[key];
    }


    public getPlane():Plane {
        return this.plane;
    }

    public getElementIdentifier():string {
        return this.name;
    }

    public isDeletableByUser():boolean {
        return this.isdeletablebyuser;
    }

    public delete(cb = null) {
        UiService.consolelog("Deleting Graph element", this, null, 5);
        this.plane.getGraphScene().getObjectGroup().remove(this);
        this.plane.getGraphScene().getThreeScene().remove(this);
        this.plane.getGraphScene().render();
    }

    public hideLabel() {
        if (!this.label)
            return;
        if (this.label instanceof Label)
            (<Label>this.label).hide();
        this.label.traverse(function (object) {
            object.visible = false;
        });
    }

    public showLabel() {
        if (!this.label)
            return;
        if (this.label instanceof Label)
            (<Label>this.label).show();
        this.label.traverse(function (object) {
            object.visible = true;
        });
    }

    public setLabelZoomAdjustmentBlocked(blocked:boolean) {
        this.labelZoomAdjustmentBlocked = blocked;
    }

    public adjustZoom(zoomLevel:number) {
        if (this.labelZoomAdjustmentBlocked)
            return;

        let isInField = HelperService.getInstance().isObjectInCameraField(this.plane, this);
        if (isInField) {
            if (this.labelType !== GRAPH_ELEMENT_LABEL_TYPE.NONE && typeof this.label === "undefined" && zoomLevel >= this.labelZoomLevelMin) {
                this.createLabel();
            }
        }
        if (isInField && this.label) {
            if (zoomLevel < this.labelZoomLevelMin && this.label.visible) {
                this.hideLabel();
            }
            else if (zoomLevel >= this.labelZoomLevelMin && !this.label.visible) {
                this.showLabel();
            }
        }
    }


    public setIsVisible(vis:boolean) {
        this.visible = vis;
        // this.getPlane().getGraphScene().render();
    }

    public getIsVisible():boolean {
        return this.visible;
    }


}