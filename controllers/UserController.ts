
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import UserModel from '../models/user';
import { Request, Response } from 'express';

export const register = async (req: Request, res: Response) => {
  try {
   const {
     email,
     fullName,
     avatarUrl,
     password,
   } = req.body;
 
   const salt = await bcrypt.genSalt(10);
   const hash = await bcrypt.hash(password, salt)
 
   const doc = new UserModel({
     email,
     fullName,
     avatarUrl,
     passwordHash: hash,
   })
 
   const user = await doc.save();
 
   const token = jwt.sign(
     {
       _id: user._id,
     },
       'secret123',
     {
       expiresIn: '30d',
     })
 
   // @ts-ignore
   const { passwordHash, ...userData} = user._doc;
     
   res.json({
     ...userData,
     token,
   });
  } catch (error) {
   console.log(error);
   res.status(500).json({
     message: 'Не удалось зарегестрироваться'
   });
  }
 }

 export const login = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден"
      })
    }

    // @ts-ignore 
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль"
      })
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
        'secret123',
      {
        expiresIn: '30d',
      })

      // @ts-ignore
  const { passwordHash, ...userData} = user._doc;
    
  res.json({
    ...userData,
    token,
  });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось авторизоваться'
    });
  }
}

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден"
      })
    }

      // @ts-ignore
    const { passwordHash, ...userData} = user._doc;
    
    res.json({
      ...userData,
    });
  } catch (error) {
    
  }
}