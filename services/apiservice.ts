import {Injectable} from "@angular/core";


@Injectable()
/**
 * Service for allowing the API to communicate with GVF.
 * This communication is event based to allow using GVF inside an IFrame.
 * @author Peter Hasitschka
 */
export class ApiService {



    private registeredEvents = [];

    static instance:ApiService;
    static isCreating:Boolean = false;
    constructor() {
        this.handleTopDownEvents();
        if (!ApiService.isCreating) {
            return ApiService.getInstance();
        }
    }
    /**
     * Getting the singleton instance of the Service
     * @returns {UiService}
     */
    static getInstance() {
        if (ApiService.instance == null) {
            ApiService.isCreating = true;
            ApiService.instance = new ApiService();
            ApiService.isCreating = false;
        }
        return ApiService.instance;
    }


    private handleTopDownEvents() {
        window.addEventListener("message", this.handleTopDownEvent.bind(this), false);
    }

    private handleTopDownEvent(e) {
        if (typeof e.data.type === "undefined" || e.data.type !== "gvfapidownevent")
            return;
        this.registeredEvents.forEach((r)=> {
            if (r.name === e.data.name)
                r.fct(e.data.data);
        });
    }

    public registerEvent(name:string, fct) {
        this.registeredEvents.push({
            name: name,
            fct: fct
        });
    }


    sendEvent(eventName:string, data) {
        //let evt = new CustomEvent(eventName, {detail: data});
        //window.parent.dispatchEvent(evt);

        let out = {
            type: "gvfapiupevent",
            name: eventName,
            data: data
        };
        window.parent.postMessage(out, "*");
        console.log("Send event", out);
    }


}