import { setQueue } from '../stages';
import { storage } from '../storage';
export const stageFour = {
  exec({ from,message, client  }) {
      storage[from].stage = 3;
      switch (message) {
        case '1':
          setQueue({from:from,queue:'TCOM'})
        break;
        case '2':
          setQueue({from:from,queue:'TCOM'})
        break;
        case '3':
          setQueue({from:from,queue:'TCOM'})
        break;
      
        default:
          break;
      }
      client.markUnseenMessage(from);
      return '🔃 Encaminhando você para um analista. \n⏳ *Informe qual sua necessidade*.';
    
     
    
   
  },
};
