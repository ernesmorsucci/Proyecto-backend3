import GenericRepository from "./Generic.repository.js";

export default class PetRepository extends GenericRepository{
    constructor(dao){
        super(dao);
    }
}