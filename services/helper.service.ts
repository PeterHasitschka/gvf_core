import {Injectable} from "@angular/core";


@Injectable()
/**
 * Service for allowing the UI elements to communicate.
 * Optional singleton concept => Usage in non-components (where injection does not work): DataService.getInstance()
 * @author Peter Hasitschka
 */
export class HelperService {


    static instance:HelperService;
    static isCreating:Boolean = false;


    constructor() {
        if (!HelperService.isCreating) {
            return HelperService.getInstance();
        }
    }

    /**
     * Getting the singleton instance of the Service
     * @returns {UiService}
     */
    static getInstance() {
        if (HelperService.instance == null) {
            HelperService.isCreating = true;
            HelperService.instance = new HelperService();
            HelperService.isCreating = false;
        }
        return HelperService.instance;
    }


    public canvasCoordsToWorldCoords(plane, x, y):THREE.Vector3 {
        let canvasSize = plane.getCanvasSize();
        let camera = plane.getGraphScene().getThreeCamera();
        var vector = new THREE.Vector3();

        vector.set(
            ( x / canvasSize['x'] ) * 2 - 1,
            -( y / canvasSize['y'] ) * 2 + 1,
            0.5);

        vector.unproject(camera);
        vector.z = 0.0;
        return vector;
    }


    public worldCoordsToCanvasCoords(plane, obj:THREE.Object3D) {
        var vector = new THREE.Vector3();

        let canvasSize = plane.getCanvasSize();
        let camera = plane.getGraphScene().getThreeCamera();

        obj.updateMatrixWorld(true);
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(camera);

        vector.x = ( vector.x * canvasSize['x'] * 0.5 ) + canvasSize['x'] * 0.5;
        vector.y = -( vector.y * canvasSize['y'] * 0.5 ) + canvasSize['y'] * 0.5;
        return {
            x: vector.x,
            y: vector.y
        };
    }

}