import {Learner} from './data/learner'
import {Resource} from './data/resource'
import {Activity} from './data/activity'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'

/**
 * Service for loading resource, learner, and activity data.
 * @author Peter Hasitschka
 */
export class AfelDataFetcher {

    private data;

    static instance:AfelDataFetcher;
    static isCreating:Boolean = false;

    static DUMMYDATA = {
        learners: 'dummydata/frenchcourse/learners.json',
        resources: 'dummydata/frenchcourse/resources.json',
        activities: 'dummydata/frenchcourse/activities.json',
    };

    /**
     * Creating the singleton instance
     * @param http
     * @returns {DataService}
     */
    constructor() {
        this.data = {
            learners: [],
            resources: [],
            activities: []
        };
        if (!AfelDataFetcher.isCreating) {
            return AfelDataFetcher.getInstance();
        }
    }


    /**
     * Getting the singleton instance of the DataSErvice
     * @param http
     * @returns {DataService}
     */
    static getInstance() {
        if (AfelDataFetcher.instance == null) {
            AfelDataFetcher.isCreating = true;
            AfelDataFetcher.instance = new AfelDataFetcher();
            AfelDataFetcher.isCreating = false;
        }
        return AfelDataFetcher.instance;
    }


    /**
     * Fetching data.
     * @returns {null}
     */
    fetchData() {
        return this.fetchDataFromServer();
    }


    /**
     * Fetching and returning learners, resources, and activities from the server.
     * Returned as Promise.
     * @returns {Promise<TResult>}
     */
    fetchDataFromServer() {
        console.log("Fetching learning-platform data from server...");
        return this.fetchLearners()
            .then(() => {
                return this.fetchResources()
            })
            .then(() => {
                return this.fetchActivities()
            })
    }


    /**
     * Fetching the learners from server, returning as promise
     * @returns {Promise<TResult>}
     */
    fetchLearners() {
        console.log("Fetching learners data from server...");
        return null;

        // return this.http.get(AfelDataFetcher.DUMMYDATA.learners)
        //     .map(res => res.json())
        //     .toPromise()
        //     .then((r) => {
        //         r.forEach((resultdata) => {
        //             let learner = new Learner(resultdata);
        //             this.data.learners.push(learner);
        //         });
        //         console.log("Fetched Learners:", this.data.learners);
        //     });
    }

    /**
     * Fetching the resources from server, returning as promise
     * @returns {Promise<TResult>}
     */
    fetchResources() {
        console.log("Fetching resource data from server...");
        return null;
        // return this.http.get(AfelDataFetcher.DUMMYDATA.resources)
        //     .map(res => res.json())
        //     .toPromise()
        //     .then((r) => {
        //         r.forEach((resultdata) => {
        //             let resource = new Resource(resultdata);
        //             this.data.resources.push(resource);
        //         });
        //         console.log("Fetched Resources:", this.data.resources);
        //     });
    }

    /**
     * Fetching the activities from server, returning as promise
     * @returns {Promise<TResult>}
     */
    fetchActivities() {
        console.log("Fetching activities data from server...");
        return null;
        // return this.http.get(AfelDataFetcher.DUMMYDATA.activities)
        //     .map(res => res.json())
        //     .toPromise()
        //     .then((r) => {
        //         r.forEach((resultdata) => {
        //             let act = new Activity(resultdata);
        //             this.data.activities.push(act);
        //         });
        //         console.log("Fetched Activties:", this.data.activities);
        //     });
    }

    /**
     * Return the (stored) learners
     * @returns {Array}
     */
    getLearners():Learner[] {
        return this.data.learners;
    }

    /**
     * Return the (stored) resources
     * @returns {Array}
     */
    getResources():Resource[] {
        return this.data.resources;
    }

    /**
     * Return the (stored) activities
     * @returns {Array}
     */
    getActivities():Activity[] {
        return this.data.activities;
    }
}


var AFELDATAFETCHER = new AfelDataFetcher();