import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';

class UserController {
  async store(req: Request, res: Response) {
    const repository = getRepository(User);
    const { email, password } = req.body;

    const userExists = await repository.findOne({ where: { email } });

    if (userExists) {
      return res.status(409).send({
        message:
          'Já existe um usuário cadastrado com este e-mail. Tente recuperar sua senha caso a tenha esquecido.',
      });
    }

    const user = repository.create({ email, password });
    await repository.save(user);

    return res.json(user);
  }

  // TODO: test purposes
  async index(req: Request, res: Response) {
    res.send({ userId: req.userId });
  }
}

export default new UserController();
