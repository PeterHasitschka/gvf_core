import { Component } from '@angular/core';
import {ThreeJsScene} from '../graphvis/scene';
import {Learner} from '../graphvis/data/learner';
import {GraphVisConfig} from '../graphvis/config';
import {GraphAbstract} from '../graphvis/graphs/abstract';

export class Plane {

    private containerId: number;
    private scene: ThreeJsScene;
    static containerPrefix: string = "graphvisplanecontainer_";
    private graph: GraphAbstract;


    constructor(private name: string, graphtype: string) {

        try {
            this.graph = new GraphVisConfig.active_graphs[graphtype];
        } catch (e) {

            console.error("Could not create graph of type '" + graphtype + "'!");
        }

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