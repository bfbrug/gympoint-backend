import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number()
        .positive()
        .required(),
      peso: Yup.number()
        .positive()
        .required(),
      altura: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails ' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const { id, name, email, idade, peso, altura } = await Student.create({
      name: req.body.name,
      email: req.body.email,
      idade: req.body.idade,
      peso: req.body.peso,
      altura: req.body.altura,
      user_id: req.userId,
    });

    return res.json({
      id,
      name,
      email,
      idade,
      peso,
      altura,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      idade: Yup.number(),
      peso: Yup.number(),
      altura: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails ' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (!studentExists) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    // console.log(studentExists);

    const { id, name, email, idade, peso, altura } = await studentExists.update(
      {
        name: req.body.name,
        email: req.body.email,
        idade: req.body.idade,
        peso: req.body.peso,
        altura: req.body.altura,
        user_id: req.userId,
      }
    );

    return res.json({
      id,
      name,
      email,
      idade,
      peso,
      altura,
    });
  }
}

export default new StudentController();
