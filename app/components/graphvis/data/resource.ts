export class Resource {

    private static idCounter = 0;

    private id: number;
    constructor(private data: Object) {
        this.id = Resource.idCounter;
        Resource.idCounter++;
    }


    public getId(): number {
        return this.id;
    }
}