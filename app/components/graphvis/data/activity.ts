export class Activity {
    private static idCounter = 0;

    private id: number;
    constructor(private data: Object) {
        this.id = Activity.idCounter;
        Activity.idCounter++;
    }


    public getId(): number {
        return this.id;
    }
}