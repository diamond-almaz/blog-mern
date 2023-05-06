import express from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import * as Validations from './validations';
import UserModel from './models/user';
import checkAuth from './utils/checkAuth';
import * as UserController from './controllers/UserController';
import * as PostController from './controllers/PostController';

mongoose.connect('mongodb+srv://diamondsharipov:wwwwww@cluster0.4j6xniy.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => {
  console.log('DB OK')
})
.catch((err) => {
  console.log("DB ERROR", err)
})

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
  res.send('hello world')
})

app.post('/auth/login', Validations.loginValidation ,UserController.login)
app.post('/auth/register', Validations.registerValidation, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe) 

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, Validations.postCreateValidation, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, PostController.update)


app.listen(4444, () => {

  console.log('Server is working');
})