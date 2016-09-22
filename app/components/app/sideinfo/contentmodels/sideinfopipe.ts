import {Pipe, PipeTransform} from '@angular/core';
import {SideInfoModel, SideInfoPositions} from "../sideinfomodel";


@Pipe({name: 'sideinfopositionpipe'})
export class SideInfoPositionPipe implements PipeTransform {
    transform(allSideInfos:SideInfoModel[], pos:SideInfoPositions) {
        return allSideInfos.filter(sideInfo => sideInfo.getPosition() === pos);
    }
}
