import {Plane} from "../../../plane/plane";
import {HelperService} from "../../../../services/helper.service";
import {GraphObject} from "../graphobjectinterface";
export class Label extends THREE.Points {

    protected plane:Plane;
    protected svgElement;

    protected static labelList:Label[] = [];

    public static getLabelList():Label[] {
        return Label.labelList;
    }


    constructor(plane:Plane) {
        var dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(new THREE.Vector3(0, 0, 10));
        var dotMaterial = new THREE.PointsMaterial({size: 10, sizeAttenuation: false, color: 0xFF0000});
        super(dotGeometry, dotMaterial);
        this.plane = plane;

        var labelContainer = plane.getGraphScene().getLabelContainer();

        var template = <HTMLTemplateElement>document.createElement('template');
        template.innerHTML = '<svg><text x="50" y="50" fill="red">I am a Label!</text></svg>';
        this.svgElement = template.content.firstChild;

        labelContainer.appendChild(this.svgElement);
        this.updateSvgPos();

        Label.labelList.push(this);
    }

    public updateSvgPos() {
        let posCanvas = this.getPosCanvas();
        this.svgElement.getElementsByTagName("text")[0].setAttribute("x", posCanvas['x']);
        this.svgElement.getElementsByTagName("text")[0].setAttribute("y", posCanvas['y']);
    }

    public getPosCanvas() {
        let helper = HelperService.getInstance();
        return helper.worldCoordsToCanvasCoords(this.plane, this);
    }

    public setPosCanvas(x:number, y:number) {
        let helper = HelperService.getInstance();
        let posVec = helper.canvasCoordsToWorldCoords(this.plane, x, y);
        console.log(posVec);
        this.geometry.vertices[0].setX(posVec.x);
        this.geometry.vertices[0].setY(posVec.y);

        this.updateSvgPos();
    }


}
