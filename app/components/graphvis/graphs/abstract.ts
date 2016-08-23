import {Plane} from '../../plane/plane';
import {DataAbstract} from '../data/abstract';

/**
 * Abstract Graph Class
 * Holding the corresponding data and the plane
 * Each Graph only holds ONE TYPE OF DATA
 * Currently there are no plans for mixing them up!
 * @author Peter Hasitschka
 */
export abstract class GraphAbstract {

    /**
     * The data of a specific type (learner, resource, ...) for this plane
     */
    protected data: DataAbstract[];

    constructor(protected plane: Plane) {

    }

    /**
     * Init method for loading data and creating the layout and nodes
     */
    public init(): void {

    }

    /**
     * Loading data abstract
     */
    protected loadData(after_load): void {
    }

}