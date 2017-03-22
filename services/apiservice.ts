import {Injectable} from "@angular/core";


@Injectable()
/**
 * Service for allowing the API to communicate with GVF.
 * This communication is event based to allow using GVF inside an IFrame.
 * @author Peter Hasitschka
 */
export class ApiService {



    sendEvent(eventName:string, data) {
        let evt = new CustomEvent(eventName, {detail: data});
        //window.parent.dispatchEvent(evt);
    }

}