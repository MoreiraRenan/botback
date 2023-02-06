import { menu, menuFinanceiro } from '../menu';
import { storage } from '../storage';

export const stageOne = {
  exec({ from, message, client }) {
    console.log(message)
    if (message === '1') {
      let msg = '*Selecione um atendimento*\n\n';
      Object.keys(menu).map((value) => {
        const element = menu[value];
        if (value === '1') {
          msg += `1️⃣ - ${element.description}\n`;
        } else if (value === '2') {
          msg += `2️⃣ - ${element.description} \n`;
        } else if (value === '3') {
          msg += `3️⃣ - ${element.description} \n`;
        }
      });


      storage[from].stage = 2;

      return msg;
    } else if (message === '2') {
      let msg = '*Selecione um atendimento*\n\n';
      Object.keys(menuFinanceiro).map((value) => {
        const element = menuFinanceiro[value];
        if (value === '1') {
          msg += `1️⃣ - ${element.description} \n`;
        } else if (value === '2') {
          msg += `2️⃣ - ${element.description} \n`;
        } else if (value === '3') {
          msg += `3️⃣ - ${element.description} \n`;
        }
      });

      storage[from].stage = 2;
      

      return msg;
    } 

    return '❌ *Digite uma opção válida, por favor.* \n';
  },
};
