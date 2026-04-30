import {adoptionService,petsService,usersService} from "../services/index.service.js";

const getAllAdoptions=async(req,res)=>{
    const result=await adoptionService.getAll();
    res.send({status:'succes',payload:result});
}
const getAdoption=async(req,res)=>{
    const adoptionId=req.params.aid;
    const adoption=await adoptionService.getBy({_id:adoptionId});
    if(!adoption) return res.status(404).send({status:'error',error:'Adoption not found'});
    res.send({status:'succes',payload:adoption});
}
const createAdoption=async(req,res)=>{
    const {uid,pid} = req.params;
    const user=await usersService.getUserById(uid);
    if(!user) return res.status(404).send({status:'error',error:'User not found'});
    const pet=await petsService.getBy({_id:pid});
    if(!pet) return res.status(404).send({status:'error',error:'Pet not found'});
    if(pet.adopted) return res.status(400).send({status:'error',error:'Pet is alredy adopted'});
    user.pets.push(pet._id);
    await usersService.update(user._id,{pets:user.pets});
    await petsService.update(pet._id,{adopted:true,owner:user._id});
    await adoptionService.create({owner:user._id,pet:pet._id});
    res.send({status:'succes',message:'Pet adopted'});
}

export default{
    getAllAdoptions,
    getAdoption,
    createAdoption
}