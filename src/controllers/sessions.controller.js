import {usersService} from "../services/index.service.js";
import {createHash,passwordValidation} from "../utils/index.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/Users.dto.js";

const register=async(req,res)=>{
    try{
        const {first_name,last_name,email,password}=req.body;
        if(!first_name||!last_name||!email||!password) return res.status(400).send({status:'error',error:'Incomplete values'});
        const exists=await usersService.getUserByEmail(email);
        if(exists) return res.status(400).send({status:'error',error:'User alredy exists'});
        const hashedPassword=await createHash(password);
        const user={
            first_name,
            last_name,
            email,
            password:hashedPassword
        }
        const result=await usersService.create(user);
        res.send({status:'succes',payload:result});
    }catch(error){
        return res.status(500).send({status:'error',error:'Server failed'});
    }
}
const login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password) return res.status(400).send({status:'error',error:'Incomplete values'});
    const user=await usersService.getUserByEmail(email);
    if(!user) return res.status(404).send({status:'error',error:"User doesn't exists"});
    const isValidPassword=await passwordValidation(user,password);
    if(!isValidPassword) return res.status(400).send({status:'error',error:'Incorrect password'});
    const userDto=UserDTO.getUserTokenFrom(user);
    const token=jwt.sign(userDto,'tokenSecretJWT',{expiresIn:'1h'});
    res.cookie('coderCookie',token,{maxAge:3600000}).send({status:'succes',message:'Logged in'});
}
const current=async(req,res)=>{
    const cookie=req.cookies['coderCookie'];
    const user=jwt.verify(cookie,'tokenSecretJWT');
    if(user) return res.send({status:'succes',paylod:user});
}
const unprotectedLogin = async (req, res) => {
    const {email,password}=req.body;
    if(!email||!password) return res.status(400).send({status:'error',error:'Incomplete values'});
    const user=await usersService.getUserByEmail(email);
    if(!user) return res.status(404).send({status:'error',error:"User doesn't exist"});
    const isValidPassword=await passwordValidation(user, password);
    if(!isValidPassword) return res.status(400).send({status:'error',error:'Incorrect password'});
    const token=jwt.sign(user,'tokenSecretJWT',{expiresIn:'1h'});
    res.cookie('unprotectedCookie',token,{maxAge:3600000}).send({status:'success', message: 'Unprotected Logged in'})
}
const unprotectedCurrent=async(req,res)=>{
    const cookie=req.cookies['unprotectedCookie'];
    const user=jwt.verify(cookie,'tokenSecretJWT');
    if(user) return res.send({status:'succes',paylod:user});
}

export default{
    register,
    login,
    current,
    unprotectedLogin,
    unprotectedCurrent
}