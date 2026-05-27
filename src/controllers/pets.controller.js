import PetDTO from "../dto/Pets.dto.js";
import {petsService} from "../services/index.service.js";
import __dirname from "../utils/index.js"

const getAllPets=async(req,res)=>{
    const pets=await petsService.getAll();
    res.send({status:'success',payload:pets});
}
const createPet=async(req,res)=>{
    const {name,specie,birthDate}=req.body;
    if(!name||!specie||!birthDate) return res.status(400).send({status:'error',error:'Incomplete values'});
    const pet=PetDTO.getPetInputFrom({name,specie,birthDate});
    const result=await petsService.create(pet);
    res.send({status:'success',payload:result});
}
const updatePet=async(req,res)=>{
    const petId=req.params.pid;
    const petUpdateBody=req.body;
    const pet=await petsService.getBy({_id:petId});
    if(!pet) return res.status(404).send({status:'error',error:'Pet not found'});
    const result=await petsService.update(petId,petUpdateBody);
    res.send({status:'success',message:'Pet updated',payload:result});
}
const deletePet=async(req,res)=>{
    const petId=req.params.pid;
    const pet=await petsService.getBy({_id:petId});
    if(!pet) return res.status(404).send({status:'error',error:'Pet not found'});
    const result=await petsService.delete(petId);
    res.send({status:'success',message:'Pet deleted',payload:result});
}
const createPetWithImage=async(req,res)=>{
    const file=req.file
    const {name,specie,birthDate}=req.body;
    if(!name||!specie||!birthDate) return res.status(400).send({status:'error',error:'Incomplete values'});
    console.log(file);
    const pet=PetDTO.getPetInputFrom({
        name,
        specie,
        birthDate,
        image:`${__dirname}/../public/img/${file.filename}`
    });
    const result=await petsService.create(pet);
    res.send({status:'success',payload:result});
}

export default{
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}