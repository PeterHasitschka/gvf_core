export class Learner {

    private static idCounter = 0;

    private id: number;
    constructor(private data: Object) {
        this.id = Learner.idCounter;
        Learner.idCounter++;
    }


    public getId(): number {
        return this.id;
    }
}