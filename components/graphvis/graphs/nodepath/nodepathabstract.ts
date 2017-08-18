import {NodeAbstract} from "../nodes/nodeelementabstract";
import {ElementAbstract} from "../graphelementabstract";
import {Plane} from "../../../plane/plane";
import {GraphVisConfig} from "../../config";
import {last} from "rxjs/operator/last";
import {HelperService} from "../../../../services/helper.service";
export abstract class NodepathAbstract extends ElementAbstract {

    protected nodesToConnect:NodeAbstract[];
    protected lines:THREE.Line[] = [];
    protected nodes:THREE.Mesh[] = [];

    protected createNodes = true;

    protected lineColor1;
    protected lineColor2;
    protected lineWidth;
    protected opacity;
    protected startEndNodeSize;

    constructor(nodesToConnect:NodeAbstract[], plane:Plane, options:{}) {

        super(0, 0, null, plane, {});

        this.nodesToConnect = nodesToConnect;

        let config = GraphVisConfig.graphelements.nodepath;

        this.lineColor1 = typeof options['lineColor1'] !== "undefined" ? options['lineColor1'] : config.linecolor1;
        this.lineColor2 = typeof options['lineColor2'] !== "undefined" ? options['lineColor2'] : config.linecolor2;
        this.lineWidth = typeof options['lineWidth'] !== "undefined" ? options['lineWidth'] : config.linewidth;
        this.opacity = typeof options['opacity'] !== "undefined" ? options['opacity'] : config.opacity;
        this.startEndNodeSize = typeof options['startEndNodeSize'] !== "undefined" ? options['startEndNodeSize'] : config.startEndNodeSize;
        this.createNodes = typeof options['createNodes'] !== "undefined" ? options['createNodes'] : this.createNodes;


        let lastPos = null;
        this.nodesToConnect.forEach((n:NodeAbstract, k) => {

            let nodePos = n.getPosition();
            let posToSet = new THREE.Vector3(nodePos.x, nodePos.y, 10);

            if (!lastPos) {
                lastPos = posToSet;

                if (this.createNodes) {
                    let startNode = new THREE.Mesh(new THREE.CircleGeometry(
                        5,
                        GraphVisConfig.graphelements.abstractnode.segments),
                        new THREE.MeshBasicMaterial(
                            {
                                color: this.lineColor1,
                                opacity: 1
                            }));
                    startNode.position.set(lastPos.x, lastPos.y, 11);
                    this.nodes.push(startNode);
                    this.add(startNode);
                }

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

        if (this.createNodes) {
            let endNode = new THREE.Mesh(new THREE.CircleGeometry(
                7,
                GraphVisConfig.graphelements.abstractnode.segments),
                new THREE.MeshBasicMaterial(
                    {
                        color: this.lineColor2,
                        opacity: 1
                    }));

            endNode.position.set(lastPos.x, lastPos.y, 10);
            this.nodes.push(endNode);
            this.add(endNode);
        }

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


    public getNodeList():NodeAbstract[] {
        return this.nodesToConnect;
    }

}