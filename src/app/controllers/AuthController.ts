import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import { SECRET } from '../../../constants';

class UserController {
  async authenticate(req: Request, res: Response) {
    const repository = getRepository(User);
    const { email, password } = req.body;

    const user = await repository.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send({
        message: 'Usuário não encontrado!',
      });
    }

    const isPasswordValid = bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({
        message: 'A senha está incorreta!',
      });
    }

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '30d' });

    delete user.password;

    return res.json({ user, token });
  }
}

export default new UserController();
