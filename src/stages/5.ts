import { storage } from '../storage';

export const Pesquisa = {
  exec({ from,message, client  }) {
    storage[from].stage = 6;
    return `Avalie o atendimento do OPERADOR, sendo:\n
    0ï¸â£- *PÃ©ssimo*Â ð¢\n
    1ï¸â£- *Ruim* ð\n
    2ï¸â£- *Poderia ser melhor!* ð\n
    3ï¸â£- *Bom* ð\n
    4ï¸â£- *Ãtimo!* ð\n
    5ï¸â£- *Excelente ! Melhor Atendimento!* ðððð\n`
    //return 'ð OlÃ¡, como vai? \n\nEu sou Bill, o *assistente virtual* da Skill. \n*Como posso de ajudar?* ðââï¸ \n1ï¸â£ - ```Suporte Tecnico``` \n2ï¸â£ - ```Financeiro```\n3ï¸â£ - ```Outros assuntos```\n';
  },
};