import {Component} from '@angular/core';
import {GraphScene} from '../graphvis/scene';
import {Learner} from '../graphvis/data/learner';
import {GraphVisConfig} from '../graphvis/config';
import {GraphAbstract} from '../graphvis/graphs/abstract';

/**
 * The Plane Object holds the @see{GraphScene} element and connects to the
 * HTML element.
 * It gets initialized by its component @see{PlaneComponent}.
 * The @see{GraphScene} gets created and the graph, defined in the
 * constructor's parameter is built.
 * Finally the graph's init() method is called.
 */
export class Plane {

    private containerId:number;
    private scene:GraphScene;
    static containerPrefix:string = "graphvisplanecontainer_";
    private graph:GraphAbstract;

    /**
     * @param{string} name - Defining the graph's name
     * @param{string} graphtype - @see{GraphVisConfig} for possible strings
     */
    constructor(private name:string, private graphtype:string) {

    }

    /**
     * Called after making sure the container exists
     * @param{number} containerId - An Id that gets combined with the containerPrefix
     * to get the (existing) element for storing the scene in it.
     *
     * At first the @see{GraphScene} gets created.
     * Then the @see{GraphAbstract} derivation.
     * Finally the graph's init method is called
     */
    public initScene(containerId:number) {

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
        this.graph = new GraphVisConfig.active_graphs[this.graphtype](this);
        // try {
        // } catch (e) {
        //
        //     console.error("Could not create graph of type '" + this.graphtype + "'!", e);
        // }
        // Load Data from DataService and build the graph
        this.graph.init();

    }

    /**
     * Calculating the width and height of the defined container
     */
    public calculateCanvasSize():Object {
        var container = document.getElementById(Plane.containerPrefix + this.containerId);
        return {x: container.clientWidth - 10, y: container.clientHeight - 30};
    }


    public getName():string {
        return this.name;
    }

    public getContainerPrefix():string {
        return Plane.containerPrefix;
    }

    public getGraphScene():GraphScene {
        if (!this.scene)
            console.error("Could not get Graph Scene - Not initialized yet?");
        return this.scene;
    }

}