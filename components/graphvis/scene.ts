import {GraphVisConfig} from './config';
import {SceneMouseInteractions} from "./scenemouseinteractions";
import {Plane} from "../plane/plane";
import {UiService} from "../../services/ui.service";
import {Label} from "./graphs/labels/label";
import {ThreeWebGlRendererMoving} from "./three/threewebglrenderer";
import {ElementAbstract} from "./graphs/graphelementabstract";
import {HelperService} from "../../services/helper.service";
import {NodeAbstract} from "./graphs/nodes/nodeelementabstract";
import {AnimationService} from "../../services/animationservice";


//const THREE = require('../../../node_modules/three/build/three.js');

/**
 * Container holding the THREE.js Scene
 * Should act as an interface between the logic and THREE.js
 * @author Peter Hasitschka
 */
export class GraphScene {

    private threeScene:THREE.Scene;
    private threeRenderer:ThreeWebGlRendererMoving
    private threeCamera:THREE.Camera;
    private threeRaycaster:THREE.Raycaster;
    private SceneMouseInteractions:SceneMouseInteractions;
    private objectGroup:THREE.Group;


    /**
     * @constructor of the GraphScene
     * @param{HTMLMElement} container - Container to hold the canvas
     * @param{Object} dimensions - Simple object holding 'x' and 'y' value, defining the size
     */
    constructor(private container:HTMLElement, private plane:Plane) {
        var config = GraphVisConfig.scene;
        var canvasW = plane.getCanvasSize()["x"],
            canvasH = plane.getCanvasSize()["y"];

        this.threeRenderer = new ThreeWebGlRendererMoving({alpha: true, antialias: true});


        this.threeCamera = new THREE.OrthographicCamera(
            canvasW / -2,
            canvasW / 2,
            canvasH / 2,
            canvasH / -2,
            config.near,
            config.far);


        //this.threeCamera = new THREE.PerspectiveCamera(45, canvasW / canvasH, config.near, config.far);
        this.threeScene = new THREE.Scene();


        this.threeScene.add(this.threeCamera);

        this.threeCamera.position.z = config.camera.z;
        //this.threeCamera['zoom'] = 0.5;

        this.setSizeToPlane();
        this.threeRenderer.setClearColor(0xffffff, 0);

        this.container.appendChild(this.threeRenderer.domElement);

        this.SceneMouseInteractions = new SceneMouseInteractions(this);
        this.threeRaycaster = new THREE.Raycaster();
        //this.threeRaycaster.precision = 5.0;

        this.objectGroup = new THREE.Group();
        this.objectGroup.name = "Graph Scene Group";
        this.threeScene.add(this.objectGroup);
    }

    public setSizeToPlane() {
        var canvasW = this.plane.getCanvasSize()["x"],
            canvasH = this.plane.getCanvasSize()["y"];
        this.threeRenderer.setSize(canvasW, canvasH, false);

        this.threeCamera['left'] = -canvasW / 2;
        this.threeCamera['right'] = canvasW / 2;
        this.threeCamera['top'] = canvasH / 2;
        this.threeCamera['bottom'] = -canvasH / 2;
        this.threeCamera['updateProjectionMatrix']();

        this.render();
    }

    /**
     * Adding an object to the scene's container
     * @param obj
     */
    public addObject(obj:THREE.Object3D) {
        this.objectGroup.add(obj);
    }

    /**
     * Call the 'render' method of the THREE Renderer
     */
    public render():void {
        if (!this.plane.getIsMinimized()) {
            this.threeRenderer.render(this.threeScene, this.threeCamera);
            UiService.consolelog("Rendering Graph Scene " + this.plane.getId(), this, null, 10);
        }

        Label.getLabelList().forEach((l) => {
            if (l.getIsVisible())
                l.updateSvgPos();
        })

    }

    public zoomIn():void {
        let val = this.threeCamera['zoom'] * GraphVisConfig.scene.camera.zoomfactor;
        this.setZoomVal(val);
    }

    public zoomOut():void {
        let val = this.threeCamera['zoom'] / GraphVisConfig.scene.camera.zoomfactor;
        this.setZoomVal(val);
    }

    public getZoomVal():number {
        return this.threeCamera['zoom'];
    }

    public setZoomVal(val):void {
        this.threeCamera['zoom'] = val;

        this.threeCamera['updateProjectionMatrix']();

        Label.getLabelList().forEach((l) => {
            if (l.getIsVisible())
                l.adjustZoom();
        });

        this.objectGroup.children.forEach((elm) => {
            if (elm instanceof ElementAbstract) {
                (<ElementAbstract>elm).adjustZoom(this.threeCamera['zoom']);
            }
        });
        this.render();
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

    public getThreeRenderer():ThreeWebGlRendererMoving {
        return this.threeRenderer;
    }

    public getContainer():HTMLElement {
        return this.container;
    }

    public getLabelContainer():SVGSVGElement {
        return <SVGSVGElement>this.container.getElementsByClassName("labelcontainer")[0];
    }

    public getCanvas():HTMLCanvasElement {
        return <HTMLCanvasElement>this.container.getElementsByTagName("canvas")[0];
    }

    /**
     * Returning the container that holds all the scene's objects
     * @returns {THREE.Object3D}
     */
    public getObjectGroup():THREE.Object3D {
        return this.objectGroup;
    }

    public getSceneMouseInteractions():SceneMouseInteractions {
        return this.SceneMouseInteractions;
    }


    public fitAllNodesInView(callback) {
        UiService.consolelog("Fitting all nodes into view...", this, null, 1);
        let minFactorOfNodesMustBeVisible = 1.0;

        let maxStepsOut = 200;
        let currSteps = 0;
        while (this.factorNodesVisible(minFactorOfNodesMustBeVisible) && currSteps < maxStepsOut) {
            this.plane.getGraphScene().getThreeCamera()['zoom'] *= 1.01;
            this.plane.getGraphScene().getThreeCamera()['updateProjectionMatrix']();
            currSteps++;
        }

        currSteps = 0;
        while (!this.factorNodesVisible(minFactorOfNodesMustBeVisible) && currSteps < maxStepsOut) {
            this.plane.getGraphScene().getThreeCamera()['zoom'] /= 1.05;
            this.plane.getGraphScene().getThreeCamera()['updateProjectionMatrix']();
            currSteps++;
        }

        if (callback)
            callback();
    }

    private factorNodesVisible(minFactor:number):boolean {
        let vis = 0;
        let countAll = 0;
        this.objectGroup.children.forEach((e:ElementAbstract, i) => {
            if (!(e instanceof NodeAbstract))
                return;
            countAll++;
            if (HelperService.getInstance().isObjectInCameraField(this.plane, e)) {
                vis += 1;
            }
        });
        let out = vis / countAll >= minFactor;
        return out;
    }

    public setCameraPosition(pos) {
        this.threeCamera.position.setX(pos.x);
        this.threeCamera.position.setY(pos.y);
        this.threeCamera['updateProjectionMatrix']();
    }

    public getCameraPosition() {
        return {
            x: this.threeCamera.position.x,
            y: this.threeCamera.position.y
        }
    }

    public moveCameraAnimated(goal, cb = null) {
        AnimationService.getInstance().register(
            "camerapos",
            {'x': goal.x, 'y': goal.y},
            null,
            this.getCameraPosition.bind(this),
            this.setCameraPosition.bind(this),
            0,
            0.1,
            0.001,
            1,
            function () {
                if (cb)
                    cb();
            },
            true,
            this.plane
        );
    }

    public zoomCameraAnimated(goal, cb = null) {
        AnimationService.getInstance().register(
            "camerazoom",
            goal,
            null,
            this.getZoomVal.bind(this),
            this.setZoomVal.bind(this),
            0,
            0.1,
            0.001,
            2,
            function () {
                if (cb)
                    cb();
            },
            true,
            this.plane
        );
    }
}