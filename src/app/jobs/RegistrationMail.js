import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { registrationMail } = data;

    console.log(registrationMail.student.name);

    await Mail.sendMail({
      to: `${registrationMail.student.name} <${registrationMail.student.email}>`,
      subject: 'Matricula realizada com sucesso',
      template: 'registration',
      context: {
        student: registrationMail.student.name,
        start_date: format(
          parseISO(registrationMail.start_date),
          "'dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        end_date: format(
          parseISO(registrationMail.end_date),
          "'dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        plan: registrationMail.plan.title,
        price: registrationMail.price,
      },
    });
  }
}

export default new RegistrationMail();
