import { Component } from '@angular/core';
import {Plane} from '../plane/plane';
import {GraphVisConfig} from '../graphvis/config';

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

    public getGridClasses(): string {
        var c = GraphVisConfig.plane_grid;
        var out = "col-xs-" + (12 / c.xs) + " col-sm-" + (12 / c.sm) +
            " col-md-" + (12 / c.md) + " col-lg-" + (12 / c.lg);

        return out;
    }

} 