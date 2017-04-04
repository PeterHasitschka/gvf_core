import {Plane} from "../../../plane/plane";
import {HelperService} from "../../../../services/helper.service";
import {GraphObject} from "../graphobjectinterface";
export class Label extends THREE.Points {

    protected plane:Plane;
    protected svgElement;
    protected options;
    protected hidden = false;

    protected static labelList:Label[] = [];

    public static getLabelList():Label[] {
        return Label.labelList;
    }


    constructor(plane:Plane, text, posX, posY, options) {


        super(new THREE.Geometry(), new THREE.PointsMaterial({
            size: 0,
            sizeAttenuation: false,
            color: 0x0000FF
        }));

        this.geometry.vertices.push(new THREE.Vector3(0, 0, 0));

        let preOptions = {
            color: "red",
            zval: 10,
            centerX: true,
            centerY: true,
            rotateDegree: 0,
            strokeWidth: 0.5,
            strokeColor: 'black',
            fontSize: 13,
            hidden: false,
            turnAroundWhenUpsidedown: true,
            turnAroundLimit: 100
        };

        for (var key in preOptions) {
            if (typeof  options[key] === "undefined")
                options[key] = preOptions[key];
        }


        this.options = options;

        this.position.set(posX, posY, options.zval);
        this.plane = plane;

        var labelContainer = plane.getGraphScene().getLabelContainer();


        var template = <HTMLTemplateElement>document.createElement('template');
        let canvasPos = this.getPosCanvas();

        template.innerHTML = '<svg><text x="0" y="0">' + text + '</text></svg>';
        this.svgElement = template.content.firstChild;

        let textElm = this.svgElement.getElementsByTagName("text")[0];
        textElm.setAttribute('fill', options.color);
        textElm.setAttribute('transform', 'rotate(' + this.getRotationDegree() + ',' + canvasPos['x'] + ',' + canvasPos['y'] + ')');
        textElm.setAttribute('style', "stroke: " + options.strokeColor + "; stroke-width: " + options.strokeWidth + "");
        textElm.setAttribute('font-size', options.fontSize);
        if (this.options.hidden)
            this.hide();

        labelContainer.appendChild(this.svgElement);
        this.updateSvgPos();
        Label.labelList.push(this);
    }

    protected getRotationDegree() {
        let rot = this.options.rotateDegree;
        if (this.options.turnAroundWhenUpsidedown &&
            rot > this.options.turnAroundLimit &&
            rot < 360 - this.options.turnAroundLimit)
            rot = 0;
        return rot;
    }

    public updateSvgPos() {
        let posCanvas = this.getPosCanvas();
        let textElm = this.svgElement.getElementsByTagName("text")[0];

        var bbox = textElm.getBBox();
        var width = bbox.width;
        var height = bbox.height;
        let posX = posCanvas['x'] - (this.options.centerX ? width / 2.0 : 0);
        let posY = posCanvas['y'] + (this.options.centerY ? height / 2.0 : 0);
        textElm.setAttribute("x", posX);
        textElm.setAttribute("y", posY);
        let rotateCenterX = posX + (width / 2);
        let rotateCenterY = posY + (height / 2);


        textElm.setAttribute("transform", 'rotate(' + this.getRotationDegree() + ',' + posCanvas['x'] + ',' + posCanvas['y'] + ')');
    }

    public getPosCanvas() {
        let helper = HelperService.getInstance();
        return helper.worldCoordsToCanvasCoords(this.plane, this);
    }

    public setPosCanvas(x:number, y:number) {
        let helper = HelperService.getInstance();
        let posVec = helper.canvasCoordsToWorldCoords(this.plane, x, y);
        this.geometry.vertices[0].setX(posVec.x);
        this.geometry.vertices[0].setY(posVec.y);

        this.updateSvgPos();
    }


    public hide() {
        if (this.hidden)
            return;

        this.hidden = true;

        let textElm = this.svgElement.getElementsByTagName("text")[0];
        textElm.setAttribute("visibility", "hidden");
    }

    public show() {
        if (!this.hidden)
            return;

        this.hidden = false;

        let textElm = this.svgElement.getElementsByTagName("text")[0];
        textElm.setAttribute("visibility", "visible");
        this.updateSvgPos();
    }

    public getIsVisible() {
        return !this.hidden;
    }

}
