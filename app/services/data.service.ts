import { Injectable } from '@angular/core';
import { Learner } from '../components/graphvis/data/learner'
import { Resource} from '../components/graphvis/data/resource'
import { Activity } from '../components/graphvis/data/activity'



@Injectable()
/**
 * Service for loading resource, learner, and activity data.
 * Singleton concept => Usage: DataService.getInstance()
 * @author Peter Hasitschka
 */
export class DataService {


    static instance: DataService;
    static isCreating: Boolean = false;

    constructor() {
        if (!DataService.isCreating) {
            throw new Error("You can't call new in Singleton instances!");
        }
    }

    static getInstance() {
        if (DataService.instance == null) {
            DataService.isCreating = true;
            DataService.instance = new DataService();
            DataService.isCreating = false;
        }

        return DataService.instance;
    }


    getLearners(): Promise<Learner[]> {
        return Promise.resolve(this.getDummyLearners());
    }
    getResources(): Promise<Resource[]> {
        return Promise.resolve(this.getDummyResources());
    }
    getActivities(): Promise<Activity[]> {
        return Promise.resolve(this.getDummyActivities());
    }



    /**
     * Dummy data below!
     */

    private dummyLearners = [
        new Learner({ name: "Hans", experience: Math.random() }),
        new Learner({ name: "Werner", experience: Math.random() }),
        new Learner({ name: "Hubert", experience: Math.random() }),
        new Learner({ name: "Jörg", experience: Math.random() }),
        new Learner({ name: "Karl", experience: Math.random() }),
        new Learner({ name: "Sepp", experience: Math.random() }),
    ];
    private dummyResources = [
        new Resource({ title: "Algebra 1", complexity: Math.random() }),
        new Resource({ title: "Trigonometry", complexity: Math.random() }),
        new Resource({ title: "Algebra 2", complexity: Math.random() }),
        new Resource({ title: "Austrian History", complexity: Math.random() }),
        new Resource({ title: "European Politics", complexity: Math.random() }),
        new Resource({ title: "WWII", complexity: Math.random() }),
        new Resource({ title: "Classical Music", complexity: Math.random() }),
    ];

    private dummyActivities = [
        new Activity({ type: "learning", learner_id: 0, resource_id: 2 }),
        new Activity({ type: "learning", learner_id: 0, resource_id: 3 }),
        new Activity({ type: "learning", learner_id: 1, resource_id: 1 }),
        new Activity({ type: "learning", learner_id: 1, resource_id: 3 }),
    ];


    getDummyLearners(): Learner[] {
        return this.dummyLearners;
    }
    getDummyResources(): Resource[] {
        return this.dummyResources;
    }
    getDummyActivities(): Activity[] {
        return this.dummyActivities;
    }
}