import { Component, ViewChild } from '@angular/core';
import { Plane } from '../plane/plane';
import {GraphworkspaceComponent} from '../graphworkspace/graphworkspace.component';
import {DataService} from '../../services/data.service';

@Component({
    selector: 'afel-app',
    templateUrl: 'app/components/app/app.html',
    styleUrls: ['app/components/app/app.css']
})
export class AppComponent {
    @ViewChild(GraphworkspaceComponent) graphworkspace: GraphworkspaceComponent;
    constructor() {

    }

    addDummyPlane(): void {
        this.graphworkspace.addPlane(new Plane("Plane something " + Math.random(), 'resource'));
    }


    showData(): void {
        DataService.getInstance().getLearners().then(learners => {
            console.log("LEARNERS:", learners);
        }
        );
        DataService.getInstance().getResources().then(resources => {
            console.log("RESOURCES:", resources);
        }
        );
        DataService.getInstance().getActivities().then(activities => {
            console.log("ACTIVITIES:", activities);
        }
        );
    }
}