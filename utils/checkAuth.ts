import jwt from 'jsonwebtoken';

export default (req: any, res: any, next: any) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  console.log(token);

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret123');

      // @ts-ignore
      req.userId = decoded._id;

      next();
    } catch (error) {
      return res.status(403).json({
        message: "Нет доступа",
      })    }
  } else {
    return res.status(403).json({
      message: "Нет доступа",
    })
  }
}