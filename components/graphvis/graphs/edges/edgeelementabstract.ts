import {GraphVisConfig} from '../../config';
import {start} from "repl";
import {GraphObject} from "../graphobjectinterface";
import {Plane} from "../../../plane/plane";
import {NodeAbstract} from "../nodes/nodeelementabstract";
import LineCurve3 = THREE.LineCurve3;
import {BasicConnection} from "../../data/databasicconnection";
import Vector2 = THREE.Vector2;


/**
 * Abstract class of an Edge for the GraphVis
 * Derived from the @see{THREE.Line} class.
 * Thus, it holds a geometry and a material
 * but also its two connecting graphelements
 * @author Peter Hasitschka
 */
export abstract class EdgeAbstract extends THREE.Line implements GraphObject {


    protected threeMaterial:THREE.LineBasicMaterial;
    protected threeGeometry:THREE.Geometry;
    protected zPos;
    protected color:number;
    protected opacity;
    protected origOpacity;
    protected plane:Plane;
    protected sourceNode:NodeAbstract;
    protected destNode:NodeAbstract;
    protected addRandom;
    protected isHighlighted;
    protected weight;
    protected connectionEntity:BasicConnection;
    protected numPointsOnCurve;
    protected rawVertices:THREE.Vector2[];
    protected splineOptions;


    /**
     * Creating an edge by taking the graphelements and the plane
     * Nodes and config-values define the geometry and material
     * @param sourceNode
     * @param destNode
     * @param plane
     * @param connectionEntity BasicConnection Optional connection entity
     * @param options Optional options. E.g. Spline options ('spline')
     */
    constructor(sourceNode:NodeAbstract, destNode:NodeAbstract, plane:Plane, connectionEntity:BasicConnection = null, options = null) {

        let startX:number = sourceNode.getPosition()['x'];
        let startY:number = sourceNode.getPosition()['y'];
        let endX:number = destNode.getPosition()['x'];
        let endY:number = destNode.getPosition()['y'];

        let config = GraphVisConfig.edges;
        let color = config.abstractedge.color;


        // if (this.addRandom)
        //     color = this.addRandomColorValue(color);
        let material = new THREE.LineBasicMaterial({
            color: color,
            linewidth: config.abstractedge.thickness,
            opacity: 1.0,
            transparent: true
        });


        let splineOptions = {
            spline: true,
            splineOnLineOffset: 0.5,
            splineNormalLengthFactor: 0.1,
            left: true
        };

        if (options && typeof options['spline'] !== "undefined")
            splineOptions = options['spline'];

        let numPointsOnCurve = config.abstractedge.numPointsOnSpline;
        if (typeof splineOptions['numPointsOnSpline'] !== "undefined")
            numPointsOnCurve = splineOptions['numPointsOnSpline'];

        /**
         *
         * @param startEndPoints
         * @param splineOptions
         * @returns {any}
         */
        let calculateSplineVerticesFromRawStartEndPoints = function (startEndPoints:THREE.Vector2[], splineOptions):THREE.Vector2[] {

            if (!splineOptions['spline'])
                return startEndPoints;

            let start = startEndPoints[0];
            let end = startEndPoints[1];

            let vect = new THREE.Vector2(end.x - start.x, end.y - start.y); // Calculate a vector between start and end
            let vectPart = vect.clone().multiplyScalar(splineOptions['splineOnLineOffset']);   // find a point on
            // that vector (e.g. the half = 0.5)
            let normal = vect.clone().multiplyScalar(splineOptions['splineNormalLengthFactor'])
                .rotateAround(new THREE.Vector2(0, 0), Math.PI / 2.0); // Calculate the normal with a specific
            // length (e.g. 0.5 is half) of the original vector

            if (splineOptions['left'])  // Add this normal at the half-point of the whole vector and add start again
                vectPart.add(normal).add(start);
            else
                vectPart.sub(normal).add(start);
            return [start, vectPart, end];
        };

        let rawVertices = [
            new THREE.Vector2(startX, startY),
            new THREE.Vector2(endX, endY)
        ];
        let curve = new THREE.SplineCurve(calculateSplineVerticesFromRawStartEndPoints(rawVertices, splineOptions));
        let path = new THREE.Path(curve.getPoints(numPointsOnCurve));
        var geometry = path.createPointsGeometry(numPointsOnCurve);
        geometry.translate(0, 0, config.abstractedge.z_pos);
        super(geometry, material);
        this.rawVertices = rawVertices;
        this.splineOptions = splineOptions;

        this.calculateSplineVerticesFromRawStartEndPoints = calculateSplineVerticesFromRawStartEndPoints.bind(this);


        this.weight = 0;
        this.numPointsOnCurve = numPointsOnCurve;


        this.plane = plane;

        this.sourceNode = sourceNode;
        this.destNode = destNode;

        this.color = color;
        this.threeGeometry = geometry;
        this.threeMaterial = material;
        this.zPos = config.abstractedge.z_pos;

        this.origOpacity = this.opacity;
        this.frustumCulled = false;
        this.connectionEntity = connectionEntity;
    }

    private addRandomColorValue(color:number):number {

        let variableColVal = 100;

        let colR = color >> 16;
        let colG = (color >> 8) - (colR << 8);
        let colB = color - ((color >> 8) << 8);

        console.log(color.toString(16), colR.toString(16), colG.toString(16), colB.toString(16));

        let randDiff = (variableColVal / 2) - Math.floor(Math.random() * variableColVal + 0.5);
        colR = Math.max(0x00, Math.min(0xff, colR + randDiff));
        colG = Math.max(0x00, Math.min(0xff, colG + randDiff));
        colB = Math.max(0x00, Math.min(0xff, colB + randDiff));

        color = (colR << 16) + (colG << 8) + colB;
        console.log((colR << 16).toString(16), (colG << 8).toString(16), colB.toString(16), color.toString(16), randDiff);

        return color;
    }


    public setWeight(weight:number) {
        if (isNaN(weight))
            return false;
        let maxWeight = this.plane.getGraph().getMaxWeight(this.constructor.name);
        if (weight > maxWeight) {
            this.plane.getGraph().setMaxWeight(this.constructor.name, weight);
            maxWeight = weight;
        }
        this.weight = weight;
        this.updateWidth();
    }

    protected updateWidth() {
        let config = GraphVisConfig.edges;
        let maxWeight = this.plane.getGraph().getMaxWeight(this.constructor.name);
        this.material['linewidth'] = config.abstractedge.thickness + (this.weight / maxWeight) * config.abstractedge.weight_factor;
    }

    public getWeight():number {
        return this.weight;
    }

    /**
     * Setting a (hexadecimal) color
     * No rendering is performed!
     * @param color
     */
    public setColor(color:number) {
        this.color = color;
        this.threeMaterial.color.setHex(color);
    }

    /**
     * Setting an opacity (0 ... 1)
     * No rendering is performed!
     * @param opacity
     */
    public setOpacity(opacity:number) {
        this.opacity = opacity;
        this.threeMaterial.opacity = opacity;
    }


    /**
     * Updating the position of the edge by taking its graphelements' position
     * No rendering is performed!
     */
    public updatePositions() {
        this.rawVertices[0]['x'] = this.sourceNode.getPosition()['x'];
        this.rawVertices[0]['y'] = this.sourceNode.getPosition()['y'];
        this.rawVertices[1]['x'] = this.destNode.getPosition()['x'];
        this.rawVertices[1]['y'] = this.destNode.getPosition()['y'];

        let curve = new THREE.SplineCurve(this.calculateSplineVerticesFromRawStartEndPoints(this.rawVertices, this.splineOptions));
        let path = new THREE.Path(curve.getPoints(this.numPointsOnCurve));
        this.geometry = path.createPointsGeometry(this.numPointsOnCurve);
        this.geometry.translate(0, 0, this.zPos);
        this.threeGeometry.verticesNeedUpdate = true;
    }

    /**
     * Will be set in constructor due to super-access policy on derived classes (no access of this.something before super() call)
     * Calculates third point between the start and endpoint, depending on the splineOptions to be used as raw data for the spline
     * @param startEndPoints
     * @param splineOptions
     * @returns {null}
     */
    protected calculateSplineVerticesFromRawStartEndPoints(startEndPoints:THREE.Vector2[], splineOptions):THREE.Vector2[] {
        return null;
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
        this.threeMaterial.linewidth *= 4.0;
        this.opacity = 1.0;
        this.plane.getGraphScene().render();
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
        this.threeMaterial.linewidth /= 4.0;
        this.opacity = this.origOpacity;
        this.plane.getGraphScene().render();
    }


    /**
     * Callback on hovering the edge
     */
    public onIntersectStart():void {
        //console.log("Intersected an edge");
    }

    /**
     * Callback on leaving the edge
     */
    public onIntersectLeave():void {
        //console.log("UN-Intersected an edge");
    }

    /**
     * Return the Source-Node
     * @returns {NodeAbstract}
     */
    public getSourceNode():NodeAbstract {
        return this.sourceNode;
    }

    /**
     * Return the Destination-Node
     * @returns {NodeAbstract}
     */
    public getDestNode():NodeAbstract {
        return this.destNode;
    }


    public setIsVisible(vis:boolean) {
        this.visible = vis;
        // this.plane.getGraphScene().render();
    }

    public getIsVisible():boolean {
        return this.visible;
    }

    public getConnectionEntity():BasicConnection {
        return this.connectionEntity;
    }
}


