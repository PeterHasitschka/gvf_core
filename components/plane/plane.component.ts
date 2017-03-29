import {Component, Input, ViewEncapsulation, HostListener} from '@angular/core';
import {Plane} from './plane';
import {DataService} from '../../services/data.service';
import {SideInfoPositions, SideInfoContentType, SideInfoModel} from "../app/sideinfo/sideinfomodel";
import {UiService} from "../../services/ui.service";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../services/intergraphevents.service";


@Component({
    selector: 'graph-plane',
    templateUrl: 'gvfcore/components/plane/plane.component.html',
    styleUrls: ['gvfcore/components/plane/plane.css'],
    encapsulation: ViewEncapsulation.None,  //To allow applying css on dynamically created canvas
})
/**
 * Component holding a @see{Plane} object
 * Additionally it contains an id, that defines the container for the scene
 * @author{Peter Hasitschka}
 */
export class PlaneComponent {

    private static counter:number = 0;
    private static RESIZECSSCLASS = 'graphvisplaneresizer';

    private resize = false;
    private resizeInit = {x: null, y: null, w: null, h: null};
    private resizeGraphPlaneHtmlElement = null;


    private allData = {
        learners: null,
        resources: null,
        activities: null
    }

    // The plane object
    @Input() plane:Plane;
    private id:number;


    constructor(private uiService:UiService, private intergrapheventService:InterGraphEventService) {
        this.id = PlaneComponent.counter;
        PlaneComponent.counter++;
    }

    /**
     * Send event when mouse left this graph!
     * @param event
     */
    @HostListener('mousemove', ['$event'])
    onMousemove(event:MouseEvent) {

        if (event.buttons === 1) {
            this.cameraDrag(event.movementX, event.movementY);
        }

        if (this.intergrapheventService.planeHovered === this.getId())
            return;
        this.intergrapheventService.planeHovered = this.getId();
        this.intergrapheventService.send(INTERGRAPH_EVENTS.GRAPH_LEFT, null);
    }


    @HostListener('mousedown', ['$event'])
    onMousedown(event:MouseEvent) {

        if (event['path'][0]['className'] === PlaneComponent.RESIZECSSCLASS) {
            this.resize = true;
            this.resizeInit.x = event.screenX;
            this.resizeInit.y = event.screenY;

            this.resizeGraphPlaneHtmlElement = event['path'][2];

            this.resizeInit.w = this.resizeGraphPlaneHtmlElement.clientWidth;
            this.resizeInit.h = this.resizeGraphPlaneHtmlElement.clientHeight;
        }
    }

    @HostListener('wheel', ['$event'])
    onWheel(event) {
        if (event.deltaY < 0)
            this.plane.getGraphScene().zoomIn();
        else if (event.deltaY > 0)
            this.plane.getGraphScene().zoomOut();
        return false;
    }


    onResize(event):void {
        let diffX = event.screenX - this.resizeInit.x;
        let diffY = event.screenY - this.resizeInit.y;

        this.resizeGraphPlaneHtmlElement.style.width = this.resizeInit.w + diffX;
        this.resizeGraphPlaneHtmlElement.style.height = this.resizeInit.h + diffY;
    }

    onStopResize():void {
        if (!this.resize)
            return;

        this.resize = false;
        this.plane.calculateCanvasSize();
        this.plane.getGraphScene().setSizeToPlane();
    }

    /**
     * Initializing the scene on the @see{Plane} after making sure that
     * the container HTML element exists now
     */
    ngAfterViewInit():void {
        // this.uiService.addSideInfoElement(new SideInfoModel(
        //     this.plane.getName(),
        //     SideInfoPositions.Left,
        //     SideInfoContentType.GraphSettings,
        //     {
        //         graphtype: this.plane.getGraphType()
        //     }
        //     )
        // );

        window.setTimeout(function () {
            this.plane.initScene(this.id);
            this.intergrapheventService.addListener(INTERGRAPH_EVENTS.MOUSE_UP_GLOBAL, function () {
                this.onStopResize();
            }.bind(this));
            this.intergrapheventService.addListener(INTERGRAPH_EVENTS.MOUSE_DRAG_GLOBAL, function (e) {
                if (this.resize)
                    this.onResize(e.detail);
            }.bind(this));
        }.bind(this), 0)
    }

    public getId():number {
        return this.id;
    }


    private cameraDrag(x, y) {
        if (x === 0 && y === 0)
            return;
        let scene = this.plane.getGraphScene();
        scene.getThreeCamera().translateX(0 - x);
        scene.getThreeCamera().translateY(y);
        scene.render();

        //console.log(x, y);
    }

} 
