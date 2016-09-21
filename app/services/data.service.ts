import {Injectable} from '@angular/core';
import {Learner} from '../components/graphvis/data/learner'
import {Resource} from '../components/graphvis/data/resource'
import {Activity} from '../components/graphvis/data/activity'

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
        'leaners':[Learner],
        'resources':[Resource],
        'activities':[Activity]
    };

    constructor() {
        if (!DataService.isCreating) {
            //throw new Error("You can't call new in Singleton instances!");
            return DataService.getInstance();
        }
    }

    static getInstance() {
        if (DataService.instance == null) {
            console.log("CREATING DATASERVICE INSTANCE");
            DataService.isCreating = true;
            DataService.instance = new DataService();
            DataService.isCreating = false;
        }
        return DataService.instance;
    }


    // fetchData():{
    //     //
    // }

    getLearners():Promise<Learner[]> {
        return Promise.resolve(this.getDummyLearners());
    }

    getResources():Promise<Resource[]> {
        return Promise.resolve(this.getDummyResources());
    }

    getActivities():Promise<Activity[]> {
        return Promise.resolve(this.getDummyActivities());
    }


    /**
     * Dummy data below!
     */

    private dummyLearners = [
        new Learner({name: "Hans", experience: Math.random()}),
        new Learner({name: "Werner", experience: Math.random()}),
        new Learner({name: "Hubert", experience: Math.random()}),
        new Learner({name: "Jörg", experience: Math.random()}),
        new Learner({name: "Karl", experience: Math.random()}),
        new Learner({name: "Sepp", experience: Math.random()}),
        new Learner({name: "Rüdiger", experience: Math.random()}),
        new Learner({name: "Fritz", experience: Math.random()}),
        new Learner({name: "Franz", experience: Math.random()}),
        new Learner({name: "Kurt", experience: Math.random()}),
        new Learner({name: "Peter", experience: Math.random()}),
        new Learner({name: "Lukas", experience: Math.random()}),
    ];
    private dummyResources = [
        new Resource({title: "Algebra 1", complexity: Math.random()}),
        new Resource({title: "Trigonometry", complexity: Math.random()}),
        new Resource({title: "Algebra 2", complexity: Math.random()}),
        new Resource({title: "Austrian History", complexity: Math.random()}),
        new Resource({title: "European Politics", complexity: Math.random()}),
        new Resource({title: "WWII", complexity: Math.random()}),
        new Resource({title: "Classical Music", complexity: Math.random()}),
    ];

    private dummyActivities = [
        new Activity({type: "learning", learner_id: 0, resource_id: 2}),
        new Activity({type: "learning", learner_id: 0, resource_id: 3}),
        new Activity({type: "learning", learner_id: 1, resource_id: 1}),
        new Activity({type: "learning", learner_id: 1, resource_id: 3}),
        new Activity({type: "communicating", learner1_id: 0, learner2_id: 1}),
        new Activity({type: "communicating", learner1_id: 0, learner2_id: 3}),
        new Activity({type: "communicating", learner1_id: 1, learner2_id: 2}),
        new Activity({type: "communicating", learner1_id: 2, learner2_id: 3}),
    ];


    getDummyLearners():Learner[] {
        return this.dummyLearners;
    }

    getDummyResources():Resource[] {
        return this.dummyResources;
    }

    getDummyActivities():Activity[] {
        return this.dummyActivities;
    }
}