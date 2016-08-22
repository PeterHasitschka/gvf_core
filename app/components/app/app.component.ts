import { Component, ViewChild } from '@angular/core';
import { Plane } from '../plane/plane';
import {GraphworkspaceComponent} from '../graphworkspace/graphworkspace.component';

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
        this.graphworkspace.addPlane(new Plane("Plane something " + Math.random()));
    }

}