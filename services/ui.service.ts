import {Injectable} from "@angular/core";
import {SideInfoModel} from "../components/app/sideinfo/sideinfomodel";
import {GraphworkspaceComponent} from "../components/graphworkspace/graphworkspace.component";
import {Plane} from "../components/plane/plane";
import {ElementAbstract} from "../components/graphvis/graphs/graphelementabstract";
import {NodeAbstract} from "../components/graphvis/graphs/nodes/nodeelementabstract";
import {AnimationService} from "./animationservice";


@Injectable()
/**
 * Service for allowing the UI elements to communicate.
 * Optional singleton concept => Usage in non-components (where injection does not work): DataService.getInstance()
 * @author Peter Hasitschka
 */
export class UiService {

    public sideInfoElements:SideInfoModel[];

    static instance:UiService;
    static isCreating:Boolean = false;

    private graphWorkSpaceSvgElement:HTMLElement = null;
    public graphWorkSpaceSvgElementVisible = true;
    private graphWorkSpace:GraphworkspaceComponent = null;

    public intergraphConnections = [];

    private minimizedPlanes:Plane[] = [];


    constructor() {
        this.sideInfoElements = [];
        if (!UiService.isCreating) {
            return UiService.getInstance();
        }
    }


    /**
     * Getting the singleton instance of the Service
     * @returns {UiService}
     */
    static getInstance() {
        if (UiService.instance == null) {
            UiService.isCreating = true;
            UiService.instance = new UiService();
            UiService.isCreating = false;
        }
        return UiService.instance;
    }


    public setGraphWorkSpace(gws:GraphworkspaceComponent) {
        this.graphWorkSpace = gws;
    }

    public getGraphWorkSpace():GraphworkspaceComponent {
        return this.graphWorkSpace;
    }

    public setGraphWorkSpaceSvgElement(el:HTMLElement) {
        this.graphWorkSpaceSvgElement = el;
    }

    public getGraphWorkSpaceSvgElement():HTMLElement {
        return this.graphWorkSpaceSvgElement;
    }

    public setGraphWorkSpaceSvgElementVisible(visible:boolean) {
        this.graphWorkSpaceSvgElementVisible = visible;
    }

    public getGraphWorkSpaceSvgElementVisible():boolean {
        return this.graphWorkSpaceSvgElementVisible;
    }

    addSideInfoElement(sideInfo:SideInfoModel) {

        let sortSideInfos = function compare(a:SideInfoModel, b:SideInfoModel) {
            if (a.getPriority() < b.getPriority())
                return -1;
            if (a.getPriority() > b.getPriority())
                return 1;
            return 0;
        };

        window.setTimeout(function () {
            this.sideInfoElements.push(sideInfo);
            this.sideInfoElements.sort(sortSideInfos);

        }.bind(this));
    }

    getSideInfoElements():SideInfoModel[] {
        return this.sideInfoElements;
    }


    addNodesToIntergraphConnection(node1, node2, color = "red") {

        if (node1.getPlane().getIsMinimized() || node2.getPlane().getIsMinimized())
            return;

        if (this.getGraphWorkSpaceSvgElementVisible()) {
            this.intergraphConnections.push({nodes: [node1, node2], color: color});
        }
    }

    clearIntergraphConnections() {
        this.intergraphConnections = [];
    }


    setPlaneMinimized(plane:Plane) {

        let isAlreadyMinimized = false;
        this.minimizedPlanes.forEach((p:Plane) => {
            if (plane === p)
                isAlreadyMinimized = true;
        });

        if (isAlreadyMinimized)
            return;

        this.minimizedPlanes.push(plane);
    }

    setPlaneRestored(plane:Plane) {
        this.minimizedPlanes.forEach((p:Plane, index) => {
            if (plane === p) {
                this.minimizedPlanes.splice(index, 1);
            }
        });
    }

    getMinimizedPlanes():Plane[] {
        return this.minimizedPlanes;
    }


    public static logLevelLimit = 1;

    /**
     * Logging to console.
     * @param text String or Object to log
     * @param srcObj class Name is displayed in log. (So use 'this' for example)
     * @param color CSS-String (Only working with text to log)
     * @param level 1-10, where 1 is most important and 10 is less important.
     */
    public static consolelog(text:any, srcObj:Object, color:string = "black", level:number = 1):void {

        if (level > UiService.logLevelLimit)
            return;

        let classColor = "#008800";

        if (typeof text === "string")
            console.log("GVFLOG-LEVEL" + level + ": " + "%c" + srcObj.constructor.name + ": " + "%c" + text, "color:" + classColor, "color:" + color);
        else
            console.log("GVFLOG-LEVEL" + level + ": " + "%c" + srcObj.constructor.name + ": ", "color:" + classColor, text);
    }
}