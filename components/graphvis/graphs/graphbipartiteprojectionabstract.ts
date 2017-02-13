import {Plane} from '../../plane/plane';
import {DataAbstract} from '../data/dataabstract';
import {GraphLayoutAbstract} from './layouts/graphlayoutabstract';
import {UiService} from "../../../services/ui.service";
import {SideInfoPositions, SideInfoContentType, SideInfoModel} from "../../app/sideinfo/sideinfomodel";
import {EdgeAbstract} from "./edges/edgeelementabstract";
import {LayoutInterface} from "./layouts/layoutinterface";
import {BasicGroup} from "../data/databasicgroup";
import {NodeAbstract} from "./nodes/nodeelementabstract";
import {ElementAbstract} from "./graphelementabstract";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../services/intergraphevents.service";
import {GroupedObservable} from "rxjs/operator/groupBy";
import {GroupAbstract} from "./groups/groupelementabstract";
import {GraphAbstract} from "./graphabstract";
import {BasicConnection} from "../data/databasicconnection";
/**
 * Abstract Auto-Create Graph Class
 * This abstract class derives from graph abstract, but extends it with an automic way to create nodes by type
 * after loading the data.
 * @author Peter Hasitschka
 */
export abstract class GraphBipartiteProjectionAbstract extends GraphAbstract {


    protected getPrimaryData():DataAbstract[] {
        return null;
    }

    protected getSecondaryData():DataAbstract[] {
        return null;
    }

    protected getConnectionsData():BasicConnection[] {
        return null;
    }


    /**
     * Init method for loading data and creating the layout and graphelements
     */
    public init():void {
        // this.createNodesData();
        // this.edges = this.createEdges();

        let data1 = this.getPrimaryData();
        let data2 = this.getSecondaryData();
        let connections = this.getConnectionsData();




        data1.forEach((data:DataAbstract) => {
            let n = new this.nodetype(0, 0, data, this.plane);
            this.plane.getGraphScene().addObject(n);
            this.graphElements.push(n);
        });

        this.edges = this.createBipartiteProjectionEdges(data1, data2, connections);





        this.layout = new this.layoutClass(this.plane, this.graphElements, this.edges);



        // this.edges.forEach((edge:EdgeAbstract) => {
        //     this.plane.getGraphScene().addObject(edge);
        // });
        this.layout.setInitPositions(() => {
            //this.plane.getGraphScene().render();
            this.layout.calculateLayout(function () {
                console.log("Finished calculating layout");
                this.plane.getGraphScene().render();
                this.addEventListeners();
            }.bind(this));
        });
    }


    protected createBipartiteProjectionEdges(dataset1, ddataset2, connections){

        console.log(dataset1);
        console.log(ddataset2);
        console.log(connections);



        return [];
    }


    /**
     * Loading data with the defined getter method
     * Nodes get created and stored in array
     * Afterwards layout gets calculated by the defined layout class
     */
    // protected createNodesData():void {
    //     let data = this.dataGetterMethod();
    //
    //     data.forEach((data:DataAbstract) => {
    //         let n = new this.nodetype(0, 0, data, this.plane);
    //         this.plane.getGraphScene().addObject(n);
    //         this.graphElements.push(n);
    //     });
    // }
}