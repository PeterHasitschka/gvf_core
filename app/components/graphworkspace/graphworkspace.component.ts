import { Component } from '@angular/core';
import {Plane} from '../plane/plane';


@Component({
    selector: 'graphworkspace',
    templateUrl: 'app/components/graphworkspace/graphworkspace.component.html',
})
export class GraphworkspaceComponent {

    private planes: Plane[];


    constructor() {
        this.planes = [];

        this.addPlane(new Plane("Plane eins"));
        this.addPlane(new Plane("Plane zwei"));
    }

    public getPlanes() {
        return this.planes;
    }

    public addPlane(plane) {
        this.planes.push(plane);
    }


} 