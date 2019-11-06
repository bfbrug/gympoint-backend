import * as Yup from 'yup';

import Plan from '../models/Plan';
import User from '../models/User';

class PlanController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const plans = await Plan.findAll({
      where: { user_id: req.userId },
      order: ['duration'],
      attributes: ['id', 'title', 'duration', 'price'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
    });
    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails ' });
    }

    const planExists = await Plan.findOne({
      where: { duration: req.body.duration },
    });

    if (planExists) {
      return res.status(400).json({ error: 'Plan already exists.' });
    }

    const { id, title, duration, price } = await Plan.create({
      ...req.body,
      ...{ user_id: req.userId },
    });

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails ' });
    }

    const plan = await Plan.findByPk(req.params.id);

    // console.log(studentExists);

    const { id, title, duration, price } = await plan.update({
      ...req.body,
      ...{ user_id: req.userId },
    });

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    await plan.destroy();

    return res.json(plan);
  }
}

export default new PlanController();
