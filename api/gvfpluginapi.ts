import {Plane} from "../components/plane/plane";
import {UiService} from "../services/ui.service";

export class PluginApi {
    static addPlane(name:string, type:Function, maximized = false) {
        UiService.getInstance().getGraphWorkSpace().addPlane(new Plane(name, type, UiService.getInstance(), null, maximized));
    }
}