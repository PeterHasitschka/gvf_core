import {ThreeJsScene} from './graphvis/scene';

export class Plane {

    private name: string;
    private container_id: number;
    private scene: ThreeJsScene;
    static container_prefix: string = "graphvisplanecontainer_";

    constructor(name: string) {
        this.name = name;
    }

    public getName() {
        return this.name;
    }

    public getContainerPrefix(): string {
        return Plane.container_prefix;
    }

    public initScene(container_id) {
        this.container_id = container_id;
        var canvasDimensions = this.calculateCanvasSize();

        var container = document.getElementById(Plane.container_prefix + this.container_id);
        this.scene = new ThreeJsScene(container, canvasDimensions);
    }

    calculateCanvasSize() {
        var container = document.getElementById(Plane.container_prefix + this.container_id);
        return { x: container.clientWidth - 10, y: container.clientHeight - 40 };
    }
}