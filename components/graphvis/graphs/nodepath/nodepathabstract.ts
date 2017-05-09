import {NodeAbstract} from "../nodes/nodeelementabstract";
import {ElementAbstract} from "../graphelementabstract";
import {Plane} from "../../../plane/plane";
import {GraphVisConfig} from "../../config";
import {last} from "rxjs/operator/last";
import {HelperService} from "../../../../services/helper.service";
export abstract class NodepathAbstract extends ElementAbstract {

    protected nodesToConnect:NodeAbstract[];
    protected lines:THREE.Line[] = [];

    protected lineColor1;
    protected lineColor2;
    protected lineWidth;
    protected opacity;

    constructor(nodesToConnect:NodeAbstract[], plane:Plane, options:{}) {

        super(0, 0, null, plane, {});

        this.nodesToConnect = nodesToConnect;

        let config = GraphVisConfig.graphelements.nodepath;

        this.lineColor1 = typeof options['lineColor1'] !== "undefined" ? options['lineColor1'] : config.linecolor1;
        this.lineColor2 = typeof options['lineColor2'] !== "undefined" ? options['lineColor2'] : config.linecolor2;
        this.lineWidth = typeof options['lineWidth'] !== "undefined" ? options['lineWidth'] : config.linewidth;
        this.opacity = typeof options['opacity'] !== "undefined" ? options['opacity'] : config.opacity;





        let lastPos = null;
        this.nodesToConnect.forEach((n:NodeAbstract, k) => {

            let nodePos = n.getPosition();
            let posToSet = new THREE.Vector3(nodePos.x, nodePos.y, 10);

            if (!lastPos) {
                lastPos = posToSet;
                return;
            }

            let material = new THREE.LineBasicMaterial({
                color: this.calculateColor(k),
                linewidth: this.lineWidth,
                opacity: this.opacity,
                transparent: true
            });

            let geometry = new THREE.Geometry();
            geometry.vertices.push(lastPos);
            geometry.vertices.push(posToSet);
            let line = new THREE.Line(geometry, material);


            this.add(line);
            this.lines.push(line);

            lastPos = posToSet;
        });

    }


    protected calculateColor(index) {

        let ratio = index / this.nodesToConnect.length;

        let rgb1 = HelperService.getInstance().colorHexToRGB(this.lineColor1);
        let rgb2 = HelperService.getInstance().colorHexToRGB(this.lineColor2);

        let rNew = Math.round(rgb1.r * ratio + rgb2.r * (1 - ratio));
        let gNew = Math.round(rgb1.g * ratio + rgb2.g * (1 - ratio));
        let bNew = Math.round(rgb1.b * ratio + rgb2.b * (1 - ratio));
        let newColor = HelperService.getInstance().rgbToHex(rNew, gNew, bNew);
        return newColor;
    }


}