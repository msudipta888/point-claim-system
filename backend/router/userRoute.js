import { Router } from "express";
import { addUser } from "../controller/addUser.js";
const route = Router();

export const addUserRoute =route.post("/user",addUser);

  