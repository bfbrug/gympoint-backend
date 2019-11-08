import * as Yup from 'yup';

import HelpOrders from '../models/HelpOrders';
import Student from '../models/Student';

import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';

class HelpOrdersController {
  async index(req, res) {
    const helpOrders = await HelpOrders.findAll({
      where: { answer: null },
      order: ['createdAt'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails ' });
    }

    const { id, question } = await HelpOrders.create({
      ...req.body,
      ...{ student_id: req.params.id },
    });

    return res.json({
      id,
      question,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails ' });
    }

    const helpOrders = await HelpOrders.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    const { id, answer } = await helpOrders.update({
      ...req.body,
      ...{ answer_at: new Date() },
    });

    await Queue.add(AnswerMail.key, {
      helpOrders,
    });

    return res.json({
      id,
      answer,
    });
  }
}

export default new HelpOrdersController();
