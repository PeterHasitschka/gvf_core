import {Injectable} from "@angular/core";


export enum INTERGRAPH_EVENTS {
    RESOURCE_NODE_HOVERED,
    RESOURCE_NODE_LEFT,
    LEARNER_NODE_HOVERED,
    LEARNER_NODE_LEFT
}

@Injectable()
/**
 * Service responsible for handling events that are sent and catched by different graphs
 * Also callable via singleton if not used in angular-logic as injected service
 */
export class InterGraphEventService {

    static instance:InterGraphEventService;
    static isCreating:Boolean = false;


    constructor() {
        if (!InterGraphEventService.isCreating) {
            return InterGraphEventService.getInstance();
        }
    }

    /**
     * Getting the service instance
     * @returns {InterGraphEventService}
     */
    static getInstance() {
        if (InterGraphEventService.instance == null) {
            InterGraphEventService.isCreating = true;
            InterGraphEventService.instance = new InterGraphEventService();
            InterGraphEventService.isCreating = false;
        }
        return InterGraphEventService.instance;
    }

    /**
     * Sending an event with specific data
     * @param evtKey
     * @param data
     */
    public send(evtKey:INTERGRAPH_EVENTS, data) {

        let evt = new CustomEvent(INTERGRAPH_EVENTS[evtKey], {detail: data});
        window.dispatchEvent(evt);
    }

    /**
     * Adding a listener for an event
     * @param evtKey
     * @param fct
     */
    public addListener(evtKey:INTERGRAPH_EVENTS, fct) {
        window.addEventListener(INTERGRAPH_EVENTS[evtKey], fct, false);
    }
}