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

        this.edges = this.createBipartiteProjectionEdges(data1[0].constructor, data2[0].constructor, connections);


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


    protected createBipartiteProjectionEdges(d1Type:Function, d2Type:Function, connections:BasicConnection[]) {

        // console.log(d1Type);
        // console.log(d2Type);
        // console.log(connections);

        let d1Containedd2s = {};
        let alreadyAffectedD1EntityPairs = [];

        connections.forEach((c:BasicConnection) => {
            let connectionEntities = c.getEntities();
            let d1Entity;
            let d2Entity;
            if (connectionEntities.src.constructor === d1Type) {
                d1Entity = connectionEntities.src;
                if (connectionEntities.dst.constructor !== d2Type)
                    console.error("SECOND CONNECTION TYPE MUST MATCH ", d2Type.name);
                d2Entity = connectionEntities.dst;
            }
            else if (connectionEntities.dst.constructor === d1Type) {
                d1Entity = connectionEntities.dst;
                if (connectionEntities.src.constructor !== d2Type)
                    console.error("SECOND CONNECTION TYPE MUST MATCH ", d2Type.name);
                d2Entity = connectionEntities.src;
            }
            else
                console.error("COULD NOT FIND DATA WITH TYPE ", d1Type.name);


            if (typeof d1Containedd2s[d1Entity.getId()] === "undefined")
                d1Containedd2s[d1Entity.getId()] = [];
            d1Containedd2s[d1Entity.getId()].push(d2Entity.getId());
        });

        console.log(d1Containedd2s);


        for (let d1_1Key in d1Containedd2s) {

            for (let d1_2Key in d1Containedd2s) {
                if (d1_1Key === d1_2Key)
                    continue;

                // Prevent going through the same combination twice
                let keyCombPairStr = Math.min(parseInt(d1_1Key), parseInt(d1_2Key)) + "-" + Math.max(parseInt(d1_1Key), parseInt(d1_2Key));
                if (alreadyAffectedD1EntityPairs.indexOf(keyCombPairStr) > -1)
                    continue;
                alreadyAffectedD1EntityPairs.push(keyCombPairStr);


                let weight = 0;
                d1Containedd2s[d1_1Key].forEach((d2Id) => {
                    d1Containedd2s[d1_2Key].indexOf(d2Id) > -1 ? weight++ : null;
                });
                console.log("Weight", weight);
                console.warn("CREATE EDGES HERE!");
                // console.log(d1Containedd2s[d1_1Key], d1Containedd2s[d1_2Key]);
            }
        }

        console.log(alreadyAffectedD1EntityPairs);
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