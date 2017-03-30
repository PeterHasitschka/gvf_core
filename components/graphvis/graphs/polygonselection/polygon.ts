import {ElementAbstract} from "../graphelementabstract";
import {Plane} from "../../../plane/plane";
import Projector = THREE.Projector;
import {HelperService} from "../../../../services/helper.service";


export class SelectionPolygon extends THREE.Group {

    private dots = [];
    private line;
    private activated = false;

    constructor(private plane:Plane) {
        super();
    }

    public addDot(x, y) {

        let dot = new THREE.Mesh(new THREE.CircleGeometry(
            3,
            32),
            new THREE.MeshBasicMaterial(
                {
                    color: 0xff0000
                }));
        let worldPos = HelperService.getInstance().canvasCoordsToWorldCoords(this.plane, x, y);
        dot.position.set(worldPos.x, worldPos.y, 0);
        this.dots.push(dot);
        this.add(dot);
        this.updateLine();
        this.plane.getGraphScene().render();
    }


    private updateLine() {
        var material = new THREE.LineBasicMaterial({
            color: 0x0000ff
        });

        var geometry = new THREE.Geometry();
        this.dots.forEach((d) => {
            geometry.vertices.push(d.position);
        });

        if (this.line)
            this.remove(this.line);
        this.line = new THREE.Line(geometry, material);
        this.add(this.line);
    }

    public startSelecting() {

        this.cleanUp();
        this.activated = true;
    }

    private cleanUp() {

        this.dots.forEach((d) => {
            this.remove(d);
            d = null;
        });
        this.dots = [];

        this.remove(this.line);
        this.line = null;
        this.plane.getGraphScene().render();
    }

    public stopSelecting() {
        this.activated = false;
        this.processSelectedNodes();
    }

    public getActivated():boolean {
        return this.activated;
    }


    private processSelectedNodes() {

        let coordinatesOfPolygon = [];
        this.dots.forEach((d:THREE.Mesh) => {
            coordinatesOfPolygon.push([d.position.x, d.position.y]);
        });

        this.plane.getGraph().getGraphElements().forEach((e:ElementAbstract) => {
            let coordinate = [e.getPosition().x, e.getPosition().y];

            let wasSelected = this.isCoordinateInsidePolygon(coordinate, coordinatesOfPolygon);

            if (wasSelected)
                e.highlight(true);
        });

        this.cleanUp();
    }

    protected isCoordinateInsidePolygon(coordinate, polygon):boolean {
        var inside = require('point-in-polygon');
        return inside(coordinate, polygon);
    }


}