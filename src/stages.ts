
var moment = require('moment');
moment.locale('pt-br');
import {

  finalStage, initialStage, menssagem, obrigado, Pesquisa, stageFour, stageOne
} from './stages/index';

import { storage } from './storage';

export const stages = [
  {
    descricao: 'BemVindo',
    stage: initialStage,
  },
  {
    descricao: 'Menu1',
    stage: stageOne,
  },
  {
    descricao: 'atendente',
    stage: stageFour,
  },
  {
    descricao: 'Assistent',
    stage: finalStage,
  },
  {
    descricao: 'Queue',
    stage: menssagem,
  },
  {
    descricao: 'Pesquisa',
    stage: Pesquisa,
  },
  {
    descricao: 'Obrigado',
    stage: obrigado,
  },
];

export function getStage({ from }) {
  if (storage[from]) {
    return storage[from].stage;
  }
  storage[from] = {
    stage: 0,
    queue: '',
    conversa: [],
    dados:null,
  };

  return storage[from].stage;
}

export function finalizar({ from }) {
  storage[from].stage = 5;

  return 'ok';
}

export  async function setConversaStorage({ from,message,type,data }) {
  return storage[from].conversa.push({
    name: message.sender.notifyName,
    text: message.body,
    audio: type == 'audio'?true:false,
    img: type == 'img'?true:false,
    video:type == 'video'?true:false,
    data: data,
    time:moment.unix(message.timestamp).format('DD/MM/YYYY HH:mm:ss')
  })
}

export function setBtConversaStorage(from,message) {
  return storage[from].conversa.push({
    name: 'bot',
    text: message,
    audio: false,
    img: false,
    video:false,
    data: null,
    time:moment().format('DD/MM/YYYY HH:mm:ss')
  })
}
export function setSendConversaStorage(from,message) {
  return storage[from].conversa.push({
    name: message.userName,
    text: message.text,
    audio: false,
    img: false,
    video:false,
    data: null,
    time:moment().format('DD/MM/YYYY HH:mm:ss')
  })
}

export function setQueue({ from,queue }) {
  return storage[from].queue = queue
}

export function GetQueue({ from }) {
  return storage[from].queue
}

export function setDadosStorage({ from,message }) {
  return storage[from].dados ={id: message.chatId,person: message.sender.notifyName,caption: message.from, img: message.sender.profilePicThumbObj.img} 
}