/**
 * The client is connection ended here. In 60 seconds, it'll closed.
 */
import { storage } from '../storage';
export const menssagem = {
  exec({ from, message, client }) {
    return storage[from].stage = 4;;
  },
};
