import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { helpOrders } = data;

    await Mail.sendMail({
      to: `${helpOrders.student.name} <${helpOrders.student.email}>`,
      subject: 'Gymppint respondeu sua pergunta',
      template: 'helpOrders',
      context: {
        student: helpOrders.student.name,
        question: helpOrders.question,
        answer: helpOrders.answer,
        created_at: format(
          parseISO(helpOrders.createdAt),
          "'dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        answer_at: format(
          parseISO(helpOrders.answer_at),
          "'dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new AnswerMail();
