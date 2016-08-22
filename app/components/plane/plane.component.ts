import { Component, Input } from '@angular/core';
import {Plane} from './plane';
import {DataService} from '../../services/data.service';


@Component({
    selector: 'graph-plane',
    templateUrl: 'app/components/plane/plane.component.html',
    styleUrls: ['app/components/plane/plane.css'],
    providers: [DataService]
})
export class PlaneComponent {

    private static counter: number = 0;

    private allData = {
        learners: null,
        resources: null,
        activities: null
    }
    @Input() plane: Plane;
    private id;


    constructor() {
        this.id = PlaneComponent.counter;
        PlaneComponent.counter++;
    }

    ngAfterViewInit() {
        this.plane.initScene(this.id);
        this.getAllLearners();
    }

    /**
     * Bring all learner-objects to the scene
     */
    private populateLearners(): void {
        console.log("Populating learners to scene!", this.allData.learners);
    }

    /**
     * Asynchronous call for loading all learners
     */
    private getAllLearners(): void {
        DataService.getInstance().getLearners().then(learners => {
            this.allData.learners = learners;
            this.populateLearners()
        }
        );
    }




    getId() {
        return this.id;
    }
} 
