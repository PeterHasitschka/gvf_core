import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../../../services/intergraphevents.service";

/**
 * Pie for usage as THREE.JS object
 */
export class Pie extends THREE.Mesh {

    /**
     *
     * @param startAngle Between 0 and PI*2 (Begin on to clockwise)
     * @param endAngle Between 0 and PI*2 (Begin on to clockwise)
     * @param radius Radius (See THREE.JS definitions)
     * @param color Integer value (eg. 0xFF0000)
     */
    constructor(startAngle, endAngle, radius, color) {
        let shape = new THREE.Shape();
        shape.moveTo(radius, 0);
        shape.absarc(0, 0, radius, 0 - (startAngle - Math.PI / 2), 0 - (endAngle - Math.PI / 2), true);
        shape.lineTo(0, 0);
        shape.closePath();
        let geometry = new THREE.ShapeGeometry(shape);

        super(geometry,
            new THREE.MeshBasicMaterial(
                {
                    color: color
                }));
    }

    /**
     * On Mouse-Hover
     * Sending an Event for notifying that node was intersected
     */
    public onIntersectStart():void {
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.METANODE_PIE_HOVERED, this);
        //this.plane.getGraphScene().render();
    }

    /**
     * On Mouse-Leave
     * Sending an Event for notifying that node was left
     */
    public onIntersectLeave():void {
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.METANODE_PIE_LEFT, this);
        //this.plane.getGraphScene().render();
    }
}