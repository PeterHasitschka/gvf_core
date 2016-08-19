import { Component, Input } from '@angular/core';
import {Plane} from './plane';


@Component({
    selector: 'graph-plane',
    templateUrl: 'app/components/plane/plane.component.html',
    styleUrls: ['app/components/plane/plane.css']
})
export class PlaneComponent {

    @Input() plane: Plane;

    constructor() {
    }

} 