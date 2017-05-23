export enum SideInfoPositions {
    Left,
    Right
}

export enum SideInfoContentType {
    DynamicInfo,
    Text,
    AppDevTools
}

/**
 * Model holding the title, the content-type and optional data for side-info content
 */
export class SideInfoModel {
    constructor(private title:String,
                private position:SideInfoPositions,
                private type:SideInfoContentType,
                private data?:{},
                private priority:number = 100,
                private dynHeight = false) {
    }

    public getTitle():String {
        return this.title;
    }

    public getPosition():SideInfoPositions {
        return this.position;
    }

    public getContentType():SideInfoContentType {
        return this.type;
    }

    public getData():{} {
        return this.data;
    }

    public getPriority():number {
        return this.priority;
    }

    public getIsDynHeight():boolean {
        return this.dynHeight;
    }
}