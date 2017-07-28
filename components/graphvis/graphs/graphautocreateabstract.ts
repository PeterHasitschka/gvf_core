import {DataAbstract} from '../data/dataabstract';
import {EdgeAbstract} from "./edges/edgeelementabstract";

import {GraphAbstract} from "./graphabstract";
/**
 * Abstract Auto-Create Graph Class
 * This abstract class derives from graph abstract, but extends it with an automic way to create nodes by type
 * after loading the data.
 * @author Peter Hasitschka
 */
export abstract class GraphAutoCreateAbstract  extends GraphAbstract{



    /**
     * Init method for loading data and creating the layout and graphelements
     */
    public init():void {
        this.createNodesData();
        this.edges = this.createEdges();
        this.layout = new this.layoutClass(this.plane, this.graphElements, this.edges);
        this.edges.forEach((edge:EdgeAbstract) => {
            this.plane.getGraphScene().addObject(edge);
        });
        this.layout.setInitPositions(() => {
            //this.plane.getGraphScene().render();
            this.layout.calculateLayout(function () {
                console.log("Finished calculating layout");
                this.plane.getGraphScene().render();
                this.addEventListeners();
            }.bind(this), null);
        });
    }


    /**
     * Loading data with the defined getter method
     * Nodes get created and stored in array
     * Afterwards layout gets calculated by the defined layout class
     */
    protected createNodesData():void {
        let data = this.dataGetterMethod();

        data.forEach((data:DataAbstract) => {
            let n = new this.nodetype(0, 0, data, this.plane);
            this.plane.getGraphScene().addObject(n);
            this.graphElements.push(n);
        });
    }
}