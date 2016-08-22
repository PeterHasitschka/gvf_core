import { Component } from '@angular/core';
import {ThreeJsScene} from '../graphvis/scene';
import {Learner} from '../graphvis/data/learner';

export class Plane {

    private name: string;
    private containerId: number;
    private scene: ThreeJsScene;
    static containerPrefix: string = "graphvisplanecontainer_";



    constructor(name: string) {
        this.name = name;
    }

    public getName() {
        return this.name;
    }

    public getContainerPrefix(): string {
        return Plane.containerPrefix;
    }

    public initScene(containerId) {
        this.containerId = containerId;
        var canvasDimensions = this.calculateCanvasSize();

        var container = document.getElementById(Plane.containerPrefix + this.containerId);
        this.scene = new ThreeJsScene(container, canvasDimensions);
    }

    calculateCanvasSize() {
        var container = document.getElementById(Plane.containerPrefix + this.containerId);
        return { x: container.clientWidth - 10, y: container.clientHeight - 40 };
    }



}