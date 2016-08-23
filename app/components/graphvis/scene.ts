import {GraphVisConfig} from './config';

//const THREE = require('../../../node_modules/three/build/three.js');

/**
 * Container holding the THREE.js Scene
 * Should act as an interface between the logic and THREE.js
 * @author Peter Hasitschka
 */
export class GraphScene {

    private threeScene: THREE.Scene;
    private threeRenderer: THREE.WebGLRenderer;
    private threeCamera: THREE.Camera;
    
    /**
     * @constructor of the GraphScene
     * @param{HTMLMElement} container - Container to hold the canvas
     * @param{Object} dimensions - Simple object holding 'x' and 'y' value, defining the size
     */
    constructor(container: HTMLElement, dimensions: Object) {

        var config = GraphVisConfig.scene;
        // set the scene size
        var canvasW = dimensions["x"],
            canvasH = dimensions["y"];

        // set some camera attributes
        var VIEW_ANGLE = config.view_angle,
            ASPECT = canvasW / canvasH,
            NEAR = config.near,
            FAR = config.far;


        // create a WebGL renderer, camera
        // and a scene
        this.threeRenderer = new THREE.WebGLRenderer({ alpha: true });
        this.threeCamera = new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR
        );

        this.threeScene = new THREE.Scene();

        // add the camera to the scene
        this.threeScene.add(this.threeCamera);

        // the camera starts at 0,0,0
        // so pull it back
        this.threeCamera.position.z = config.camera.z;

        // start the renderer
        this.threeRenderer.setSize(canvasW, canvasH);
        this.threeRenderer.setClearColor(0xffffff, 0);

        // attach the render-supplied DOM element
        container.appendChild(this.threeRenderer.domElement);

        this.render();
    }


    /**
     * Call the 'render' method of the THREE Renderer
     */
    public render(): void {
        this.threeRenderer.render(this.threeScene, this.threeCamera);
    }


    public getThreeScene(): THREE.Scene {
        return this.threeScene;
    }

    public getThreeRenderer(): THREE.WebGLRenderer {
        return this.threeRenderer;
    }
}