import {usersService} from "../services/index.service.js"

const getAllUsers=async(req,res)=>{
    //console.log("Llamando API getAllUsers");
    const users=await usersService.getAll();
    res.send({status:'success',payload:users});
}
const getUser=async(req,res)=>{
    const userId=req.params.uid;
    const user=await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:'error',error:'User not found'});
    res.send({status:'succes',payload:user});
}
const updateUser=async(req,res)=>{
    const userId=req.params.uid;
    const updateBody=req.body;
    const user=await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:'error',error:'User not found'});
    const result=await usersService.update(userId,updateBody);
    res.send({status:'succes',payload:result});
}
const deleteUser=async(req,res)=>{
    const userId=req.params.uid;
    const user=await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:'error',error:'User not found'});
    const result=await usersService.delete(userId);
    res.send({status:'succes',payload:result});
}

export default{
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
}