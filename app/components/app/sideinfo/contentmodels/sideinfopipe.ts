import {Pipe, PipeTransform} from '@angular/core';
import {SideInfoModel, SideInfoPositions} from "../sideinfomodel";

/**
 * @TODO: Not working yet.
 * Should be used to separate Left and right columns
 */
@Pipe({name: 'sideinfopositionpipe'})
export class SideInfoPositionPipe implements PipeTransform {
    transform(allSideInfos:SideInfoModel[], pos:SideInfoPositions) {
        return allSideInfos.filter(sideInfo => sideInfo.getPosition() === pos);
    }
}
