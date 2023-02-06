import { storage } from '../storage';

export const initialStage = {
  exec({ from,message, client  }) {
    storage[from].stage = 1;
    return 'Seja bem vindo (a) ao nosso canal de Atendimento 😊\n Escolha uma das opções abaixo.\n DIGITAR APENAS NUMEROS \n1️⃣ - Atendimento Telefonia \n2️⃣ -  Atendimento INFRA \n'
    //return '👋 Olá, como vai? \n\nEu sou Bill, o *assistente virtual* da Skill. \n*Como posso de ajudar?* 🙋‍♂️ \n1️⃣ - ```Suporte Tecnico``` \n2️⃣ - ```Financeiro```\n3️⃣ - ```Outros assuntos```\n';
  },
};