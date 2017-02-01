import {Plane} from '../../plane/plane';
import {GroupSimple} from "./groups/groupelementsimple";
import {GraphLayoutFdlCommunities} from "./layouts/graphlayoutfdl_communities";
import {GroupGraphAbstract} from "./graphgroupabstract";
import {GroupAbstract} from "./groups/groupelementabstract";
import {UiService} from "../../../services/ui.service";
import {BasicEntity} from "../data/databasicentity";
import {BasicGroup} from "../data/databasicgroup";


export class GroupCombinedGraphAbstract extends GroupGraphAbstract {


    constructor(protected plane:Plane) {
        super(plane);
    }


    public init():void {
        super.init();
    }


    public static generateComparedGraph(graph1:GroupGraphAbstract, graph2:GroupGraphAbstract) {


        let getIntersectionAndDistinctions = function (g1:BasicGroup, g2:BasicGroup) {

            let enew1 = [], enew2 = [], enewcomb = [];

            let entities1 = g1.getEntities();
            let entities2 = g2.getEntities();

            entities1.forEach((e1:BasicEntity) => {
                let e2Indx = entities2.indexOf(e1);
                if (e2Indx === -1) {
                    enew1.push(e1);
                } else {
                    enewcomb.push(e1);
                    entities2.slice(e2Indx, 1);
                }
            });
            enew2 = entities2;
            //console.log(enew1.length, enew2.length, enewcomb.length, entities1.length + entities2.length);

            let gnew1 = new BasicGroup(g1.constructor['getDataList']().length, enew1, {});
            let gnew2 = new BasicGroup(g2.constructor['getDataList']().length, enew2, {});
            let gnewcomb = new BasicGroup(BasicGroup.getDataList().length, enew2, {});
            return {g1only: gnew1, intersect: gnew2, g2only: gnewcomb};
        };


        let groupsToAdd = [];
        let groupElements1 = graph1.getGraphElements();
        groupElements1.forEach((groupElm1:GroupAbstract) => {

            let group1 = groupElm1.getDataEntity();
            let entitiesOfGroup1 = group1.getEntities();

            let groupElements2 = graph2.getGraphElements();
            groupElements2.forEach((groupElm2:GroupAbstract) => {
                let group2 = groupElm2.getDataEntity();

                let intersectRes = getIntersectionAndDistinctions(group1, group2);
                //groupsToAdd = groupsToAdd.concat(intersectRes.g1only).concat(intersectRes.intersect).concat(intersectRes.g2only);
                groupsToAdd = groupsToAdd.concat(intersectRes.intersect);
            });

        });
        console.log(groupsToAdd);

        let p = new Plane("Compared Communities", this, UiService.getInstance(), function () {
            return groupsToAdd;
        });
        UiService.getInstance().getGraphWorkSpace().addPlane(p);


    }

}
