import { Request, Response } from "express";
import { title } from "process";
import PostModel from '../models/post';

export const getLastTags = async (req: any, res: Response) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts.map((item) => item.tags).flat().slice(0, 5)

    res.json(tags)
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Не удалось получить статьи'
    })
  }
}

export const getAll = async (req: any, res: Response) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts)
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Не удалось получить статьи'
    })
  }
}


export const getOne = async (req: any, res: Response) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
    ).populate('user');

    res.json(post);
  } catch (error) {
    
  }
}

export const create = async (req: any, res: Response) => {
  try {
    const {
      title,
      text,
      tags,
      imageUrl,
    } = req.body;

    const doc = new PostModel({
      title,
      text,
      tags: tags.split(','),
      imageUrl,
      user: req.userId,
    })

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);

    res.status(500);
  }
}

export const remove = async (req: any, res: Response) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndRemove(
      {
        _id: postId,
      },
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
      res.json(500);
  }
}

export const update = async (req: any, res: Response) => {
  try {
    const postId = req.params.id;

    const {
      title,
      text,
      tags,
      imageUrl,
    } = req.body;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title,
        text,
        tags,
        imageUrl,
        user: req.userId,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
      res.json(500);
  }
}