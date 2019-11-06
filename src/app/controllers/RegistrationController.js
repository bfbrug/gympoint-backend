import * as Yup from 'yup';
import { parseISO, addMonths } from 'date-fns';

import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

class RegistrationController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const registrations = await Registration.findAll({
      order: ['createdAt'],
      attributes: ['id', 'start_date', 'end_date', 'price'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(registrations);
  }

  async store(req, res) {
    // console.log(addMonths(parseISO('2019-03-15'), 3));

    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails ' });
    }

    const { plan_id, start_date } = req.body;

    const { duration, price } = await Plan.findByPk(plan_id);

    const end_date = addMonths(parseISO(start_date), duration);

    const finalPrice = price * duration;

    const resgistration = await Registration.create({
      ...req.body,
      ...{ end_date, price: finalPrice },
    });

    return res.json(resgistration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails ' });
    }

    const registration = await Registration.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'duration', 'price'],
        },
      ],
    });

    const { plan_id, start_date } = req.body;

    if (plan_id) {
      const { duration, price } = await Plan.findByPk(plan_id);
      req.body.price = price * duration;
    }

    if (start_date) {
      if (plan_id) {
        const { duration } = await Plan.findByPk(plan_id);
        req.body.end_date = addMonths(parseISO(start_date), duration);
      } else {
        req.body.end_date = addMonths(
          parseISO(start_date),
          registration.plan.duration
        );
      }
    }

    const {
      id,
      student_id,
      end_date,
      duration,
      price,
    } = await registration.update(req.body);

    return res.json({
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);

    await registration.destroy();

    return res.json(registration);
  }
}

export default new RegistrationController();
