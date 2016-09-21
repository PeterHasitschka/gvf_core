import {Injectable} from '@angular/core';
import {Learner} from '../components/graphvis/data/learner'
import {Resource} from '../components/graphvis/data/resource'
import {Activity} from '../components/graphvis/data/activity'
import {Http, Response} from '@angular/http';
import 'rxjs/Rx';
import {Observable} from "rxjs/Rx";


@Injectable()
/**
 * Service for loading resource, learner, and activity data.
 * Optional singleton concept => Usage in non-components (where injection does not work): DataService.getInstance()
 * @author Peter Hasitschka
 */
export class DataService {


    static instance:DataService;
    static isCreating:Boolean = false;

    private data:{
        learners:[Learner],
        resources:[Resource],
        activities:[Activity]
    };

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

    static getInstance(http) {
        if (DataService.instance == null) {
            console.log("CREATING DATASERVICE INSTANCE");
            DataService.isCreating = true;
            DataService.instance = new DataService(http);
            DataService.isCreating = false;
        }
        return DataService.instance;
    }


    fetchData() {
        console.log("Fetching learning-platform data from server...");
        return this.fetchLearners()
            .then(() => {
                console.log("FETCH now res");
                return this.fetchResources()
            })
            .then(() => {
                console.log("FETCH now act");
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