import HelpOrders from '../models/HelpOrders';
import Student from '../models/Student';

class HelpOrdersController {
  async index(req, res) {
    const helpOrders = await HelpOrders.findAll({
      where: { student_id: req.params.id },
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
}

export default new HelpOrdersController();
