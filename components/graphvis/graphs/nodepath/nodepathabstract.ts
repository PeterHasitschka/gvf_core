import {NodeAbstract} from "../nodes/nodeelementabstract";
import {ElementAbstract} from "../graphelementabstract";
import {Plane} from "../../../plane/plane";
import {GraphVisConfig} from "../../config";
export abstract class NodepathAbstract extends ElementAbstract {

    protected nodesToConnect:NodeAbstract[];
    protected lines:THREE.Line[] = [];

    protected lineColor;
    protected lineWidth;
    protected opacity;

    constructor(nodesToConnect:NodeAbstract[], plane:Plane, options:{}) {

        super(0, 0, null, plane, {});

        this.nodesToConnect = nodesToConnect;

        let config = GraphVisConfig.graphelements.nodepath;

        this.lineColor = typeof options['lineColor'] !== "undefined" ? options['lineColor'] : config.color;
        this.lineWidth = typeof options['lineWidth'] !== "undefined" ? options['lineWidth'] : config.linewidth;
        this.opacity = typeof options['opacity'] !== "undefined" ? options['opacity'] : config.opacity;

        let material = new THREE.LineBasicMaterial({
            color: this.lineColor,
            linewidth: this.lineWidth,
            opacity: this.opacity,
            transparent: true
        });

        let geometry = new THREE.Geometry();
        this.nodesToConnect.forEach((n:NodeAbstract) => {
            let nodePos = n.getPosition();
            geometry.vertices.push(new THREE.Vector3(nodePos.x, nodePos.y, 10));
        });


        let line = new THREE.Line(geometry, material);
        this.add(line);
        this.lines.push(line);
    }


}