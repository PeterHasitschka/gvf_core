import {Plane} from '../../plane/plane';
import {GraphAbstract} from './graphabstract';
import {EdgeAbstract} from "./edges/edgeelementabstract";
import {BasicGroup} from "../data/databasicgroup";
import {GroupSimple} from "./groups/groupelementsimple";
import {GroupAbstract} from "./groups/groupelementabstract";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../services/intergraphevents.service";
import {BasicEntity} from "../data/databasicentity";
import {ElementAbstract} from "./graphelementabstract";
import {GraphLayoutFdlCommunities} from "./layouts/graphlayoutfdl_communities";


/**
 * Basic graph
 * Thus its Data consists of @see{Resource} data objects.
 * @author Peter Hasitschka
 */
export class GroupGraphAbstract extends GraphAbstract {

    protected edges:EdgeAbstract[];
    protected graphElements:GroupAbstract[];

    constructor(protected plane:Plane) {
        super(plane);

        this.nodetype = GroupSimple;

        //this.layoutClass = GraphLayoutRandom;
        this.layoutClass = GraphLayoutFdlCommunities;
    }


    public init():void {
        super.init();
        this.setInitiScales();
    }


    protected setInitiScales() {
        let nums = [];
        this.graphElements.forEach((g:GroupAbstract) => {
            let communityDataObj = <BasicGroup>g.getDataEntity();
            nums.push(communityDataObj.getEntities().length);
        });
        let max = Math.max.apply(Math, nums);

        this.graphElements.forEach((g:GroupAbstract) => {
            let communityDataObj = <BasicGroup>g.getDataEntity();
            g.setScale(communityDataObj.getEntities().length / max);
        });
        this.plane.getGraphScene().render();
    }


    protected addEventListeners() {
        super.addEventListeners();

        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.GROUP_HOVERED, function (e) {
        }.bind(this));

        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.GROUP_LEFT, function (e) {
        }.bind(this));
    }

}
