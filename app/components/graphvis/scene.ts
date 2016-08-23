import {GraphVisConfig} from './config';

//const THREE = require('../../../node_modules/three/build/three.js');

export class GraphScene {

    private threeScene: THREE.Scene;
    private threeRenderer: THREE.WebGLRenderer;
    private threeCamera: THREE.Camera;

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


        // set up the sphere vars
        var radius = Math.random() * 100,
            segments = 16,
            rings = 16;


        // create the sphere's material
        var sphereMaterial =
            new THREE.MeshLambertMaterial(
                {
                    color: 0xFF0000
                });

        // create a new mesh with
        // sphere geometry - we will cover
        // the sphereMaterial next!
        var sphere = new THREE.Mesh(

            new THREE.SphereGeometry(
                radius,
                segments,
                rings),

            sphereMaterial);

        // add the sphere to the scene
        this.threeScene.add(sphere);

        // create a point light
        var pointLight = new THREE.PointLight(0xFFFFFF);

        // set its position
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 130;

        // add to the scene
        this.threeScene.add(pointLight);

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