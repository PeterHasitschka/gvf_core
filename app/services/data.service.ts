import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import {BasicEntity} from "../components/graphvis/data/basicentity";
import {NodeSimple} from "../components/graphvis/graphs/nodes/simple";
import {BasicConnection} from "../components/graphvis/data/basicconnection";

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
        this.data = {entities:[], connections:[]};
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




        // let USER_LENGTH = 500;
        // let RESOURCE_LENGTH = 100;
        // let ACTIVITY_LEARN_LENGTH = 100;
        // let ACTIVITY_COMMUNICATE_LENGTH = 100;
        //
        // for (let i = 0; i < USER_LENGTH; i++) {
        //     this.data.learners.push(new Learner({id: i, name: "Your mum"}));
        // }
        // for (let i = 0; i < RESOURCE_LENGTH; i++) {
        //     this.data.resources.push(new Resource({id: i, title: "Soemthing", compexity: Math.random()}));
        // }
        // for (let i = 0; i < ACTIVITY_LEARN_LENGTH; i++) {
        //     this.data.activities.push(new Activity({
        //         id: i, type: "learning",
        //         learner_id: Math.floor(Math.random() * USER_LENGTH),
        //         resource_id: Math.floor(Math.random() * RESOURCE_LENGTH),
        //     }));
        // }
        // for (let i = 0; i < ACTIVITY_COMMUNICATE_LENGTH; i++) {
        //     this.data.activities.push(new Activity({
        //         id: i, type: "communicating",
        //         learner1_id: Math.floor(Math.random() * USER_LENGTH),
        //         learner2_id: Math.floor(Math.random() * USER_LENGTH),
        //     }));
        // }
        // return Promise.resolve(true);
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
        //     return this.fetchResources()
        // })
        // .then(() => {
        //     return this.fetchActivities()
        // })

    }


    fetchDemoEntities() {
        console.log("Fetching Demo Nodes data from server...",DataService.DUMMYDATA.data);
        return this.http.get(DataService.DUMMYDATA.data)
            .map(res => res.json())
            .toPromise()
            .then((r) => {
                r.nodes.forEach((resultdata) => {
                    let entity = new BasicEntity(resultdata);
                    this.data.entities.push(entity);
                });
                console.log("Fetched Entities:", this.data.entities);
            });
    }

    fetchDemoConnections() {
        console.log("Fetching Demo Connections data from server...");
        return this.http.get(DataService.DUMMYDATA.data)
            .map(res => res.json())
            .toPromise()
            .then((r) => {
                r.edges.forEach((resultdata) => {
                    let entity = new BasicConnection(resultdata);
                    this.data.connections.push(entity);
                });
                console.log("Fetched Connections:", this.data.connections);
            });
    }

    /**
     * Fetching the learners from server, returning as promise
     * @returns {Promise<TResult>}
     */
    /*
     fetchLearners() {
     console.log("Fetching learners data from server...");
     return this.http.get(DataService.DUMMYDATA.learners)
     .map(res => res.json())
     .toPromise()
     .then((r) => {
     r.forEach((resultdata) => {
     let learner = new Learner(resultdata);
     this.data.learners.push(learner);
     });
     console.log("Fetched Learners:", this.data.learners);
     });
     }
     */

    /**
     * Fetching the resources from server, returning as promise
     * @returns {Promise<TResult>}
     */
    /*
     fetchResources() {
     console.log("Fetching resource data from server...");
     return this.http.get(DataService.DUMMYDATA.resources)
     .map(res => res.json())
     .toPromise()
     .then((r) => {
     r.forEach((resultdata) => {
     let resource = new Resource(resultdata);
     this.data.resources.push(resource);
     });
     console.log("Fetched Resources:", this.data.resources);
     });
     }
     */

    /**
     * Fetching the activities from server, returning as promise
     * @returns {Promise<TResult>}
     */
    /*
     fetchActivities() {
     console.log("Fetching activities data from server...");
     return this.http.get(DataService.DUMMYDATA.activities)
     .map(res => res.json())
     .toPromise()
     .then((r) => {
     r.forEach((resultdata) => {
     let act = new Activity(resultdata);
     this.data.activities.push(act);
     });
     console.log("Fetched Activties:", this.data.activities);
     });
     }
     */
    /**
     * Return the (stored) learners
     * @returns {Array}
     */
    /*
     getLearners():Learner[] {
     return this.data.learners;
     }
     */

    /**
     * Return the (stored) resources
     * @returns {Array}
     */
    /*
     getResources():Resource[] {
     return this.data.resources;
     }
     */

    /**
     * Return the (stored) activities
     * @returns {Array}
     */
    /*
     getActivities():Activity[] {
     return this.data.activities;
     }
     */

    getDemoEntities():NodeSimple[] {
        return this.data.entities;
    }
    getDemoConnections():BasicConnection[] {
        return this.data.connections;
    }
}