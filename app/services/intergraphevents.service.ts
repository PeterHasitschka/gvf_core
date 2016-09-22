
import {Injectable} from "@angular/core";


export enum INTERGRAPH_EVENTS {
    RESOURCE_NODE_HOVERED,
    RESOURCE_NODE_LEFT
}

@Injectable()
export class InterGraphEventService {

    static instance:InterGraphEventService;
    static isCreating:Boolean = false;


    constructor() {
        if (!InterGraphEventService.isCreating) {
            //throw new Error("You can't call new in Singleton instances!");
            return InterGraphEventService.getInstance();
        }
    }

    static getInstance() {
        if (InterGraphEventService.instance == null) {
            InterGraphEventService.isCreating = true;
            InterGraphEventService.instance = new InterGraphEventService();
            InterGraphEventService.isCreating = false;
        }
        return InterGraphEventService.instance;
    }

    public send(evtKey:INTERGRAPH_EVENTS, data) {

        let evt = new CustomEvent(INTERGRAPH_EVENTS[evtKey], {detail : data});
        window.dispatchEvent(evt);
    }

    public addListener(evtKey:INTERGRAPH_EVENTS, fct) {
        window.addEventListener(INTERGRAPH_EVENTS[evtKey], fct, false);
    }
}