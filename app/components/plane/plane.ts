export class Plane {

    private name;


    constructor(name) {
        this.name = name;
    }

    public getName() {
        return this.name;
    }


    public initScene(container_identifier) {

        var canvasDimensions = this.calculateCanvasSize();
        // set the scene size
        var canvasW = canvasDimensions.x,
            canvasH = canvasDimensions.y;

        // set some camera attributes
        var VIEW_ANGLE = 100,
            ASPECT = canvasW / canvasH,
            NEAR = 0.1,
            FAR = 10000;
            
        // get the DOM element to attach to
        var container = document.getElementById(container_identifier);

        // create a WebGL renderer, camera
        // and a scene
        var renderer = new THREE.WebGLRenderer();
        var camera = new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR
        );

        var scene = new THREE.Scene();

        // add the camera to the scene
        scene.add(camera);

        // the camera starts at 0,0,0
        // so pull it back
        camera.position.z = 300;

        // start the renderer
        renderer.setSize(canvasW, canvasH);

        // attach the render-supplied DOM element
        container.appendChild(renderer.domElement);


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
        scene.add(sphere);




        // create a point light
        var pointLight = new THREE.PointLight(0xFFFFFF);

        // set its position
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 130;

        // add to the scene
        scene.add(pointLight);

        renderer.render(scene, camera);
    }

    calculateCanvasSize() {

        return { x: 100, y: 100 };
    }
}