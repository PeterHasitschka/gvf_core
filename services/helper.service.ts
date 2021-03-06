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

    public isObjectInCameraField(plane, obj:THREE.Object3D):boolean {
        var vector = new THREE.Vector3();

        let canvasSize = plane.getCanvasSize();
        let camera = plane.getGraphScene().getThreeCamera();

        obj.updateMatrixWorld(true);
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(camera);

        if (vector.x < -1 || vector.x > 1 || vector.y < -1 || vector.y > 1)
            return false;
        return true;
    }


    public colorHexToRGB(color:number) {
        let r = color >> 16;
        let g = (color >> 8) - (r << 8);
        let b = color - ((r << 16) + (g << 8));
        return {r: r, g: g, b: b};
    }

    public rgbToHex(r, g, b) {
        let _r = r << 16;
        let _g = g << 8;
        return parseInt(_r + _g + b);
    }

}