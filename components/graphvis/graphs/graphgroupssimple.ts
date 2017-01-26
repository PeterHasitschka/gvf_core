import {Plane} from '../../plane/plane';
import {GraphAbstract} from './graphabstract';
import {DataService} from '../../../services/data.service';

import {EdgeAbstract} from "./edges/edgeelementabstract";
import {GraphLayoutFdl} from "./layouts/graphlayoutfdl";
import {BasicGroup} from "../data/databasicgroup";
import {GroupSimple} from "./groups/groupelementsimple";
import {GroupAbstract} from "./groups/groupelementabstract";
import {GroupGraphAbstract} from "./graphgroupabstract";


/**
 * Basic graph
 * Thus its Data consists of @see{Resource} data objects.
 * @author Peter Hasitschka
 */
export class SimpleGroups extends GroupGraphAbstract {


    constructor(protected plane:Plane) {
        super(plane);

        this.dataGetterMethod = DataService.getInstance().getDemoGroups.bind(DataService.getInstance());
        this.nodetype = GroupSimple;
    }
}
