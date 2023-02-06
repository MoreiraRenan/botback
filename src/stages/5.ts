import { storage } from '../storage';

export const Pesquisa = {
  exec({ from,message, client  }) {
    storage[from].stage = 6;
    return `Avalie o atendimento do OPERADOR, sendo:\n
    0️⃣- *Péssimo* 😢\n
    1️⃣- *Ruim* 😔\n
    2️⃣- *Poderia ser melhor!* 😌\n
    3️⃣- *Bom* 👍\n
    4️⃣- *Ótimo!* 😃\n
    5️⃣- *Excelente ! Melhor Atendimento!* 😍👏🙏😍\n`
    //return '👋 Olá, como vai? \n\nEu sou Bill, o *assistente virtual* da Skill. \n*Como posso de ajudar?* 🙋‍♂️ \n1️⃣ - ```Suporte Tecnico``` \n2️⃣ - ```Financeiro```\n3️⃣ - ```Outros assuntos```\n';
  },
};