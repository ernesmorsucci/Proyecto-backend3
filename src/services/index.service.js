import Users from "../dao/Users.dao.js";
import Pets from "../dao/Pets.dao.js";
import Adoption from "../dao/Adoption.dao.js";

import UserRepository from "../repository/User.repository.js"
import PetRepository from "../repository/Pet.repository.js"
import AdoptionRepository from "../repository/Adoption.repository.js"

export const usersService = new UserRepository(new Users());
export const petsService = new PetRepository(new Pets());
export const adoptionService = new AdoptionRepository(new Adoption());