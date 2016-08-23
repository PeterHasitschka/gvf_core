
/**
 * Abstract Data Object
 * Holds an Id, that is incremented by each derived Class on its own
 * @author Peter Hasitschka
 */
export abstract class DataAbstract {

    protected id: number;
    constructor(protected data: Object) {

    }

    public getId(): number {
        return this.id;
    }
}