import {GraphVisConfig} from './config';
import {MouseInteractions} from "./mouseinteractions";


//const THREE = require('../../../node_modules/three/build/three.js');

/**
 * Container holding the THREE.js Scene
 * Should act as an interface between the logic and THREE.js
 * @author Peter Hasitschka
 */
export class GraphScene {

    private threeScene:THREE.Scene;
    private threeRenderer:THREE.WebGLRenderer;
    private threeCamera:THREE.Camera;
    private threeRaycaster:THREE.Raycaster;
    private mouseInteractions:MouseInteractions;
    private objectGroup:THREE.Object3D;


    /**
     * @constructor of the GraphScene
     * @param{HTMLMElement} container - Container to hold the canvas
     * @param{Object} dimensions - Simple object holding 'x' and 'y' value, defining the size
     */
    constructor(private container:HTMLElement, private dimensions:Object) {

        var config = GraphVisConfig.scene;
        // set the scene size
        var canvasW = dimensions["x"],
            canvasH = dimensions["y"];


        // create a WebGL renderer, camera
        // and a scene
        this.threeRenderer = new THREE.WebGLRenderer({alpha: true, antialias: true});


        // this.threeCamera = new THREE.OrthographicCamera(
        //     canvasW / -2,
        //     canvasW / 2,
        //     canvasH / 2,
        //     canvasH / -2,
        //     config.near,
        //     config.far);

        this.threeCamera = new THREE.PerspectiveCamera(45, canvasW / canvasH, config.near, config.far);

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
        this.container.appendChild(this.threeRenderer.domElement);

        this.mouseInteractions = new MouseInteractions(this);
        this.threeRaycaster = new THREE.Raycaster();

        this.objectGroup = new THREE.Object3D();
        this.threeScene.add(this.objectGroup);
        this.render()

    }


    /**
     * @TODO: Not perfect due to performance...
     * Thus not used currently...
     */
    public animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }


    public addObject(obj:THREE.Object3D) {
        this.objectGroup.add(obj);
    }

    /**
     * Call the 'render' method of the THREE Renderer
     */
    public render():void {
        this.threeRenderer.render(this.threeScene, this.threeCamera);
    }


    public getThreeCamera():THREE.Camera {
        return this.threeCamera;
    }

    public getThreeRaycaster():THREE.Raycaster {
        return this.threeRaycaster;
    }

    public getThreeScene():THREE.Scene {
        return this.threeScene;
    }

    public getThreeRenderer():THREE.WebGLRenderer {
        return this.threeRenderer;
    }

    public getContainer():HTMLElement {
        return this.container;
    }

    public getObjectGroup():THREE.Object3D {
        return this.objectGroup;
    }
}