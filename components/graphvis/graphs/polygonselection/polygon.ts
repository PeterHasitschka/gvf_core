import {ElementAbstract} from "../graphelementabstract";
import {Plane} from "../../../plane/plane";
import Projector = THREE.Projector;
import {HelperService} from "../../../../services/helper.service";
import {AnimationService} from "../../../../services/animationservice";
import {NodeAbstract} from "../nodes/nodeelementabstract";
import {StarChart} from "../metanodes/starchart";


export class SelectionPolygon extends THREE.Group {

    private dots = [];
    private line;
    private activated = false;
    private metanode;

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

        this.cleanUpPolygon();
        this.activated = true;
    }

    private cleanUpPolygon() {

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


        let affectedNodes = [];

        this.plane.getGraph().getGraphElements().forEach((e:ElementAbstract) => {
            let coordinate = [e.getPosition().x, e.getPosition().y];

            let wasSelected = this.isCoordinateInsidePolygon(coordinate, coordinatesOfPolygon);

            if (wasSelected) {
                e.highlight(true);
                affectedNodes.push(e);
            }

        });

        let centerPos = this.getAverageNodePosition(affectedNodes);
        this.metanode = new StarChart(centerPos.x, centerPos.y, affectedNodes, this.plane);

        let movementsToFinish = affectedNodes.length;

        affectedNodes.forEach((n:NodeAbstract) => {
            AnimationService.getInstance().register(
                "nodepos_" + n.getUniqueId(),
                {'x': centerPos.x, 'y': centerPos.y},
                null,
                n.getPosition2DForAnimation.bind(n),
                n.setPosition2DForAnimation.bind(n),
                0,
                0.5,
                0.001,
                0.1,
                function () {
                    movementsToFinish--;
                    console.log(movementsToFinish);
                    if (movementsToFinish === 0) {
                        this.onFinishCollapsingNodes();
                    }
                }.bind(this),
                true,
                this.plane
            );
        });

        this.cleanUpPolygon();
    }

    private onFinishCollapsingNodes() {
        this.add(this.metanode);
        this.plane.getGraphScene().render();
    }

    /**
     * For Demonstration the center of min and max area is taken...
     * @param affectedNodes
     */
    protected getAverageNodePosition(affectedNodes:ElementAbstract[]) {
        let minX = 1000000;
        let minY = 1000000;
        let maxX = -1000000;
        let maxY = -1000000;

        affectedNodes.forEach((n) => {
            let pos = n.getPosition2DForAnimation();
            minX = Math.min(pos.x, minX);
            minY = Math.min(pos.y, minY);
            maxX = Math.max(pos.x, maxX);
            maxY = Math.max(pos.y, maxY);
        });
        return {
            'x': (maxX - minX) / 2 + minX,
            'y': (maxY - minY) / 2 + minY
        };
    }

    protected
    isCoordinateInsidePolygon(coordinate, polygon):boolean {
        var inside = require('point-in-polygon');
        return inside(coordinate, polygon);
    }


}