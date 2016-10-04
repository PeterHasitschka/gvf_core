import {Component, Input, Directive, Renderer, ElementRef} from "@angular/core";
import {DataService} from "../../../services/data.service";
import {UiService} from "../../../services/ui.service";
import {NodeAbstract} from "../../graphvis/graphs/nodes/abstract";


@Directive({
    selector: '[intergraphconnection]',
    templateUrl: 'app/components/graphworkspace/intergraphconnections/intergraphconnection.component.html',
    styleUrls: ['']
})

/**
 * Component holding a svg-line between two planes
 * @author Peter Hasitschka
 */
export class InterGraphConnectionComponent {

    @Input() node1:NodeAbstract;
    @Input() node2:NodeAbstract;

    constructor(el:ElementRef, renderer:Renderer) {
        el.nativeElement.setAttribute("BANANA", "WURST");
        el.nativeElement.setAttribute("stroke", "red");
        el.nativeElement.setAttribute("stroke-width", "1");
        el.nativeElement.setAttribute("x1", "1");
        el.nativeElement.setAttribute("y1", "1");
        el.nativeElement.setAttribute("x2", "100");
        el.nativeElement.setAttribute("y2", "100");
        console.log("NATIVE ELEMENT", el.nativeElement);
    }

}