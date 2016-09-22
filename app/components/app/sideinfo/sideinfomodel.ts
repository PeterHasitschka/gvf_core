export enum SideInfoPositions {
    Left,
    Right
}

export enum SideInfoContentType {
    GraphSettings,
    Text
}

export class SideInfoModel {
    constructor(private title:String, private position:SideInfoPositions, private type:SideInfoContentType, private data?:{}) {

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
}