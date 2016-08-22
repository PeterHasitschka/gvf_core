import { Component } from '@angular/core';
import {GraphScene} from '../graphvis/scene';
import {Learner} from '../graphvis/data/learner';
import {GraphVisConfig} from '../graphvis/config';
import {GraphAbstract} from '../graphvis/graphs/abstract';

export class Plane {

    private containerId: number;
    private scene: GraphScene;
    static containerPrefix: string = "graphvisplanecontainer_";
    private graph: GraphAbstract;


    constructor(private name: string, graphtype: string) {

        try {
            this.graph = new GraphVisConfig.active_graphs[graphtype](this);
        } catch (e) {

            console.error("Could not create graph of type '" + graphtype + "'!", e);
        }

    }


    public initScene(containerId) {
        this.containerId = containerId;
        var canvasDimensions = this.calculateCanvasSize();

        var container = document.getElementById(Plane.containerPrefix + this.containerId);
        this.scene = new GraphScene(container, canvasDimensions);

        this.graph.loadData();


    }

    calculateCanvasSize() {
        var container = document.getElementById(Plane.containerPrefix + this.containerId);
        return { x: container.clientWidth - 10, y: container.clientHeight - 40 };
    }




    public getName() {
        return this.name;
    }

    public getContainerPrefix(): string {
        return Plane.containerPrefix;
    }

    public getGraphScene(): GraphScene {
        return this.scene;
    }

}