import {Injectable} from '@angular/core';
import {Learner} from '../components/graphvis/data/learner'
import {Resource} from '../components/graphvis/data/resource'
import {Activity} from '../components/graphvis/data/activity'
import {Http} from '@angular/http';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'

@Injectable()
/**
 * Service for loading resource, learner, and activity data.
 * Optional singleton concept => Usage in non-components (where injection does not work): DataService.getInstance()
 * @author Peter Hasitschka
 */
export class DataService {

    static USE_SERVER_DATA = false;

    static instance:DataService;
    static isCreating:Boolean = false;

    private data;


    constructor(private http:Http) {

        this.data = {
            learners: [],
            resources: [],
            activities: []
        };

        if (!DataService.isCreating) {
            //throw new Error("You can't call new in Singleton instances!");
            return DataService.getInstance(http);
        }
    }

    static getInstance(http?) {
        if (DataService.instance == null) {
            DataService.isCreating = true;
            DataService.instance = new DataService(http);
            DataService.isCreating = false;
        }
        return DataService.instance;
    }


    fetchData() {
        var ret = null;


        if (DataService.USE_SERVER_DATA)
            ret = this.fetchDataFromServer();
        else
            ret = this.fetchGeneratedDummyData().then(()=> {
                "Ready fetch data"
            });

        console.log(this.data);
        return ret;
    }

    fetchGeneratedDummyData() {

        let USER_LENGTH = 500;
        let RESOURCE_LENGTH = 100;
        let ACTIVITY_LEARN_LENGTH = 100;
        let ACTIVITY_COMMUNICATE_LENGTH = 100;

        for (let i = 0; i < USER_LENGTH; i++) {
            this.data.learners.push(new Learner({id: i, name: "Your mum"}));
        }
        for (let i = 0; i < RESOURCE_LENGTH; i++) {
            this.data.resources.push(new Resource({id: i, title: "Soemthing", compexity: Math.random()}));
        }
        for (let i = 0; i < ACTIVITY_LEARN_LENGTH; i++) {
            this.data.activities.push(new Activity({
                id: i, type: "learning",
                learner_id: Math.floor(Math.random() * USER_LENGTH),
                resource_id: Math.floor(Math.random() * RESOURCE_LENGTH),
            }));
        }
        for (let i = 0; i < ACTIVITY_COMMUNICATE_LENGTH; i++) {
            this.data.activities.push(new Activity({
                id: i, type: "communicating",
                learner1_id: Math.floor(Math.random() * USER_LENGTH),
                learner2_id: Math.floor(Math.random() * USER_LENGTH),
            }));
        }

        return Promise.resolve(true);


    }

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


    fetchLearners() {
        console.log("Fetching learners data from server...");
        return this.http.get('dummydata/dummy-learners.json')
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

    fetchResources() {
        console.log("Fetching resource data from server...");
        return this.http.get('dummydata/dummy-resources.json')
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

    fetchActivities() {
        console.log("Fetching activities data from server...");
        return this.http.get('dummydata/dummy-activities.json')
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

    getLearners():Learner[] {
        return this.data.learners;
    }

    getResources():Resource[] {
        return this.data.resources;
    }

    getActivities():Activity[] {
        return this.data.activities;
    }
}