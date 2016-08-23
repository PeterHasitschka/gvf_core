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


    constructor(private name: string, private graphtype: string) {

    }


    public initScene(containerId) {
        
        /**
         * Determine HTML container
         */
        this.containerId = containerId;
        var canvasDimensions = this.calculateCanvasSize();
        var container = document.getElementById(Plane.containerPrefix + this.containerId);
        
        /**
         * Create THREE.js Scene within GraphScene Container
         */
        this.scene = new GraphScene(container, canvasDimensions);

        /**
         * Create Graph, depending on graphtype-string
         */
        try {
            this.graph = new GraphVisConfig.active_graphs[this.graphtype](this);
        } catch (e) {

            console.error("Could not create graph of type '" + this.graphtype + "'!", e);
        }
        // Load Data from DataService
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
        if (!this.scene)
            console.error("Could not get Graph Scene - Not initialized yet?");
        return this.scene;
    }

}