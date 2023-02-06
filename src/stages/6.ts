import { storage } from '../storage';

export const obrigado = {
  exec({ from,message, client  }) {
    storage[from].stage = 0;
      client.markUnseenMessage(from);
        return 'OBRIGADO👍\n'+
       'A agradecemos o seu contato. *Qualquer dúvida estaremos à disposição!*';
  },
};
