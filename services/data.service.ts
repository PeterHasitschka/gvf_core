import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import {BasicEntity} from "../components/graphvis/data/databasicentity";
import {BasicConnection} from "../components/graphvis/data/databasicconnection";
import {BasicGroup} from "../components/graphvis/data/databasicgroup";
import {Learner} from "../../afel/graph/data/learner";
import {NodeSimple} from "../components/graphvis/graphs/nodes/nodelementsimple";

@Injectable()
/**
 * Service for loading resource, learner, and activity data.
 * Optional singleton concept => Usage in non-components (where injection does not work): DataService.getInstance()
 * @author Peter Hasitschka
 */
export class DataService {

    static instance:DataService;
    static isCreating:Boolean = false;

    private data;

    /**
     * If true, the server is used for retrieving data (also dummy data).
     * Else data is generated on the fly (e.g. for performance benchmarks)
     * @type {boolean}
     */
    static USE_SERVER_DATA = true;
    static DUMMYDATA = {
        data: 'dummydata/demobasic.json',
    };

    /**
     * Creating the singleton instance
     * @param http
     * @returns {DataService}
     */
    constructor(private http:Http) {
        this.data = {entities: [], connections: [], groups: []};
        if (!DataService.isCreating) {
            return DataService.getInstance(http);
        }
    }

    /**
     * Getting the singleton instance of the DataSErvice
     * @param http
     * @returns {DataService}
     */
    static getInstance(http?) {
        if (DataService.instance == null) {
            DataService.isCreating = true;
            DataService.instance = new DataService(http);
            DataService.isCreating = false;
        }
        return DataService.instance;
    }

    getHttp():Http {
        return this.http;
    }

    /**
     * Fetching data.
     * @param cb {Function} Optional Callback when ready
     * @returns {null}
     */
    fetchData(cb?:Function) {
        var ret = null;
        if (DataService.USE_SERVER_DATA)
            ret = this.fetchDataFromServer();
        else
            ret = this.fetchGeneratedDummyData().then(()=> {
                if (cb)
                    cb();
            });
        return ret;
    }

    /**
     * Generating and retrieving Dummy-Data
     * @returns {Promise<boolean>}
     */
    fetchGeneratedDummyData() {
        return Promise.resolve(true);
    }

    /**
     * Fetching and returning learners, resources, and activities from the server.
     * Returned as Promise.
     * @returns {Promise<TResult>}
     */

    fetchDataFromServer() {
        console.log("fetchDemoNodes learning-platform data from server...");
        return this.fetchDemoEntities()
            .then(() => {
                return this.fetchDemoConnections()
            });
            // .then(() => {
            //     return this.createDummyDemoGroups()
            // });


        // .then(() => {
        //     return this.fetchResources()
        // })
        // .then(() => {
        //     return this.fetchActivities()
        // })

    }



    fetchDemoEntities() {
        console.log("Fetching Demo Nodes data from server...", DataService.DUMMYDATA.data);
        return this.http.get(DataService.DUMMYDATA.data)
            .map(res => res.json())
            .toPromise()
            .then((r) => {
                console.log(r);
                r.nodes.forEach((resultdata) => {
                    let entity = new BasicEntity(resultdata['id'], resultdata);
                    this.data.entities.push(entity);
                });
                //console.log("Fetched Entities:", this.data.entities);
            });
    }

    fetchDemoConnections() {
        console.log("Fetching Demo Connections data from server...");
        return this.http.get(DataService.DUMMYDATA.data)
            .map(res => res.json())
            .toPromise()
            .then((r) => {
                r.edges.forEach((resultdata) => {

                    let srcNode = BasicEntity.getObject(resultdata['src']);
                    let dstNode = BasicEntity.getObject(resultdata['dst']);
                    let connection = new BasicConnection(resultdata['id'], srcNode, dstNode, resultdata);
                    //console.log(connection);
                    this.data.connections.push(connection);
                });
                //console.log("Fetched Connections:", this.data.connections);
            });
    }


    getDemoEntities():NodeSimple[] {
        return this.data.entities;
    }

    getDemoGroups():BasicGroup[] {
        return this.data.groups;
    }

    getDemoConnections():BasicConnection[] {
        return this.data.connections;
    }
}