import Collection from '../models/collection.js';
import CrudRepository from './crud-repository.js';

class CollectionRepository extends CrudRepository {
    constructor() {
        super(Collection);
    }
}

export default CollectionRepository;
