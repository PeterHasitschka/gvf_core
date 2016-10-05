import {Input, Directive, Renderer, ElementRef, OnInit} from "@angular/core";
import {NodeAbstract} from "../../graphvis/graphs/nodes/abstract";

@Directive({
    selector: '[intergraphconnection]',

})
/**
 * Directive holding a svg-line between two planes
 * Implemented not as a component but as a directive to allow using the LINE tag
 * @author Peter Hasitschka
 */
export class InterGraphConnectionDirective implements OnInit {

    @Input('nodePair') nodes;

    constructor(private el:ElementRef, private renderer:Renderer) {
        this.el.nativeElement.setAttribute("x1", "1");
        this.el.nativeElement.setAttribute("y1", "1");
        this.el.nativeElement.setAttribute("x2", "100");
        this.el.nativeElement.setAttribute("y2", "100");
    }


    ngOnInit() {
        console.log("AFTER INIT: ", this.nodes);

        let i = 1;
        this.nodes.forEach((node:NodeAbstract) => {

            let pos = node.getPosition();
            this.el.nativeElement.setAttribute("x" + i, pos.x);
            this.el.nativeElement.setAttribute("y" + i, pos.y);
            i++;
        });


        this.el.nativeElement.setAttribute("stroke", "red");
        this.el.nativeElement.setAttribute("stroke-width", "1");
        // this.el.nativeElement.setAttribute("x1", "1");
        // this.el.nativeElement.setAttribute("y1", "1");
        // this.el.nativeElement.setAttribute("x2", "100");
        // this.el.nativeElement.setAttribute("y2", "100");

    }
}