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

    protected nodetype;
    protected bipartiteEdgeType;
    protected weightLimit = 0;

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

        console.log("Creating Nodes...");
        data1.forEach((data:DataAbstract) => {
            let n = new this.nodetype(0, 0, data, this.plane);
            this.plane.getGraphScene().addObject(n);
            this.graphElements.push(n);
        });
        console.log("DONE Creating Nodes...");

        console.log("Creating Edges...");
        this.edges = this.createBipartiteProjectionEdges(data1[0].constructor, data2[0].constructor, connections);
        console.log("DONE Creating Edges...");
        this.layout = new this.layoutClass(this.plane, this.graphElements, this.edges);

        console.log("Adding Edges...");
        this.edges.forEach((edge:EdgeAbstract) => {
            //console.log(edge);
            this.plane.getGraphScene().addObject(edge);
        });
        console.log("DONE Adding Edges...");

        console.log("Bipartite graph:", this.edges.length, this.graphElements.length);

        this.layout.setInitPositions(() => {
            //this.plane.getGraphScene().render();
            this.layout.calculateLayout(function () {
                console.log("Finished calculating layout");
                this.plane.getGraphScene().render();
                this.addEventListeners();
            }.bind(this), null);
        });
    }


    protected createBipartiteProjectionEdges(d1Type:Function, d2Type:Function, connections:BasicConnection[]) {

        // console.log(d1Type);
        // console.log(d2Type);
        // console.log(connections);
        let edges = [];

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
                //console.log("Weight", d1_1Key, d1_2Key, weight);
                //console.warn("CREATE EDGES HERE!");
                // console.log(d1Containedd2s[d1_1Key], d1Containedd2s[d1_2Key]);


                if (weight < this.weightLimit)
                    continue;

                let n1 = this.getNodeByDataId(parseInt(d1_1Key));
                let n2 = this.getNodeByDataId(parseInt(d1_2Key));

                if (n1 === null || n2 === null) {
                    console.warn("One of the graphelements for creating an edge is null!", n1, n2, d1_1Key, d1_2Key);
                    return;
                }

                let learningConnection = new this.bipartiteEdgeType(n1, n2, this.plane);
                n1.addEdge(learningConnection);
                n2.addEdge(learningConnection);
                edges.push(learningConnection);

            }
        }

        console.log(alreadyAffectedD1EntityPairs);
        return edges;
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