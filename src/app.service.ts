import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { create } from 'venom-bot';
import { AppGateway } from './app.gateway';
import { finalizar, GetQueue, getStage, setBtConversaStorage, setConversaStorage, setDadosStorage, setSendConversaStorage, stages } from './stages';
import { storage } from './storage';
import fs = require('fs');
import Buffer = require('buffer/')
import mime = require('mime-types');
import path = require('path');

let clientS: any
let queue = []
let atendentes = []
let atendimentoRun = []
let qr = null
@Injectable()
export class AppService {

  constructor(@Inject(forwardRef(() => AppGateway))
  private gateway: AppGateway,
  ) {
    // create({
    //   session: 'store',
    //   multidevice: true,
    //   headless: true,
    // })
    //   .then((client) => this.start(client))
    //   .catch((error) => {
    //     console.error(error);
    //     process.exit(1);
    //   });



    create(
      'store',
      (base64Qr, asciiQR, attempts, urlCode) => {
        // Optional to log the QR in the terminal
        var matches = base64Qr.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/)
        // response = { type: null, data: null };
        qr = matches
        if (matches.length !== 3) {
          return new Error('Invalid input string');
        }
        this.gateway.server.emit('qrcode', qr);
        //response.type = matches[1];
        //response.data = new Buffer.from(matches[2], 'base64');

        // var imageBuffer = response;
        // require('fs').writeFile(
        //   'out.png',
        //   imageBuffer['data'],
        //   'binary',
        //   function (err) {
        //     if (err != null) {
        //       console.log(err);
        //     }
        //   }
        // );
      },
      undefined,
      { logQR: false }
    )
      .then((client) => {
        this.gateway.server.emit('conectado');
        this.start(client);
      })
      .catch((erro) => {
        this.gateway.server.emit('erroqr');
        console.log(erro);
      });

  }
  start(client) {
    //fila['TCOM'] = {queue:[],atendeteD:[],atendentes:[],atendimentoRun:[]}

    clientS = client
    clientS.onMessage(async (message) => {
      if (!message.isGroupMsg) {
        const currentStage = getStage({ from: message.from });
        const messageResponse = stages[currentStage].stage.exec({
          from: message.from,
          message: message.body,
          client,
        });
        if (currentStage == 0) {
          setDadosStorage({ from: message.from, message: message })
        }
        if (message.isMedia === true || message.isMMS === true) {
          const buffer = await client.decryptFile(message);
          const dirPath = path.join(__dirname, '../public/');
          const fileName = `${dirPath}arquivo01.${mime.extension(message.mimetype)}`;

          await fs.writeFile(fileName, buffer, (err) => { console.log(err) });
          await fs.readFile(fileName, { encoding: 'base64' }, async (err, data) => {
            if (err) {
              return (err);
            } else {
              //  let tfile =  await fs.unlink(fileName, (err) => {
              //       if (err) {
              //           console.error(err)
              //           return
              //       }
              //   });
              if (mime.extension(message.mimetype) == 'mp4') {
                await setConversaStorage({ from: message.from, message: message, type: 'video', data: `data:video/mp4;base64,${data}` })
                // this.gateway.server.emit('VideoToClient', {message:message,img:data});    
              } else {
                await setConversaStorage({ from: message.from, message: message, type: 'img', data: `data:image/jpeg;base64,${data}` })
                // this.gateway.server.emit('ImagemToClient', {message:message,img:data});    
              }
            }
          });
        } else if (message.waveform != undefined) {
          const buffer = await client.decryptFile(message);
          const dirPath = path.join(__dirname, '../public/');
          const fileName = `${dirPath}audio10.${mime.extension(message.mimetype)}`;

          await fs.writeFile(fileName, buffer, (err) => { console.log(err) });

          fs.readFile(fileName, { encoding: 'base64' }, (err, data) => {
            if (err) {
              return (err);
            } else {
              fs.unlink(fileName, (err) => {
                if (err) {
                  console.error(err)
                  return
                }
              });
              //this.gateway.server.emit('AudioToClient', {message:message,audio:data});
              setConversaStorage({ from: message.from, message: message, type: 'audio', data: `data:audio/x-wav;base64,${data}` })
            }
          });

        } else {
          setConversaStorage({ from: message.from, message: message, type: 'text', data: null })

        }
        if (messageResponse !== undefined) {
          setBtConversaStorage(message.from, messageResponse)
          clientS.sendText(message.from, messageResponse).then(() => {
            console.log('Message sent.');
          }).catch(error => console.error('Error when sending message', error));
        } else {
          // verifica arquivos
          await this.CheckAtendimento(message, GetQueue({ from: message.from }))
          //this.gateway.server.emit('msgToClient', {message});
        }
        const lavel = getStage({ from: message.from });
        if (lavel == 3) {
          //this.CheckQueue(message,GetQueue({from:message.from}))
          // this.gateway.server.emit('NewmsgClient', {message});
        }
      }
    });
  };
  getQr() {
    return qr;
  }
  CheckAtendimento(message, fila) {
    if (atendimentoRun.length == 0) {
      this.CheckQueue(message, fila);
    } else {
      let fil = atendimentoRun.filter(e => e.from == message.from)
      if (fil.length != 0) {
        if (message.isMedia === true || message.waveform != undefined) {
          setTimeout(() => {
            this.gateway.server.emit('msgToClient', storage[message.from]);
          }, 5000);
        } else {
          this.gateway.server.emit('msgToClient', storage[message.from]);
        }

      } else {
        this.CheckQueue(message, fila);
      }
    }
  }
  CheckQueue(message, fila) {
    let atLivre = null
    for (let x = 0; x < atendentes.length; x++) {
      if (atendentes[x].queue == fila && atendentes[x].status == 'livre') {
        atLivre = x;
        x = atendentes.length
      }

    }
    if (atLivre == null) {
      if (queue.length == 0) {
        queue.push(storage[message.from]);
      } else {
        let fil = queue.filter(e => e.dados.caption == message.from)
        if (fil.length == 0) {
          queue.push(storage[message.from]);
        }
      }
    } else {
      let pos = atLivre
      if (pos >= 0) {
        atendentes[pos].atendimentos.push(message.from)
        atendimentoRun.push({ from: message.from, to: atendentes[pos].id, queue: fila })
        if (atendentes[pos].atendimentos.length == atendentes[pos].limit) {
          atendentes[pos].status = 'ocupado';
        } else {
          const at = { ...atendentes[pos] }
          atendentes.splice(pos, 1);
          atendentes.push(at);
        }
        this.gateway.server.emit('NewmsgClient', storage[message.from]);
      }
    }
  }

  atendenteDisponivel(dado) {
    let dados = dado.payload
    let atRun = atendimentoRun.filter(e => e.to == dados.agente.id)
    if (atRun.length > 0) {
      atRun.forEach(element => {
        this.gateway.server.emit('NewmsgClient', storage[element.from]);
      });
    } else {
      if (queue.length > 0) {
        let atent = []
        let limit = 0
        let fila = queue.filter(e => e.queue == dados.fila)

        if (fila.length > dados.agente.limit) {
          limit = dados.agente.limit
        } else {
          limit = fila.length
        }
        for (let i = 0; i < limit; i++) {
          let posQ = queue.map(e => e.queue)
          let posf = posQ.indexOf(dados.fila)
          atent.push(queue[posf])
          this.gateway.server.emit('NewmsgClient', { ...queue[posf] });
          atendimentoRun.push({ from: queue[posf].dados.caption, to: dados.agente.id, queue: queue[posf].queue })
          queue.splice(posf, 1)

        }
        let statusAt = 'livre'
        if (atent.length >= dados.agente.limit) {
          statusAt = 'ocupado'
        }
        atendentes.push({ ...dados.agente, atendimentos: atent, status: statusAt, queue: dados.fila })
      } else {
        let fil = atendentes.filter(e => e.id == dados.agente.id)
        if (fil.length == 0) {
          atendentes.push({ ...dados.agente, atendimentos: [], status: 'livre', queue: dados.fila })
        }

      }
    }
  }
  sendMensage(message: any) {
    let text = `*${message.userName}* \n ${message.text}`
    setSendConversaStorage(message.from, message)
    clientS.sendText(message.from, text).then(() => {
      console.log('Message sent.');
    }).catch(error => console.error('Error when sending message', error));
  }
  setAnalistaLivre(pos) {
    setTimeout(() => {
      atendentes[pos].status = 'livre'
      for (let i = 0; i < queue.length; i++) {
        console.log(queue[i])
        for (let j = 0; j < atendentes.length; j++) {
          if (atendentes[j].queue == queue[i].queue && atendentes[j].status == 'livre') {

            this.gateway.server.emit('NewmsgClient', storage[queue[i].dados.caption]);
            atendimentoRun.push({ from: queue[i].dados.caption, to: atendentes[j].id, queue: queue[i].queue })
            atendentes[j].atendimentos.push(queue[i].dados.caption)
            if (atendentes[j].atendimentos.length >= atendentes[j].limit) {
              atendentes[j].status = 'ocupado'
            }

            queue.splice(i, 1)
            i = queue.length;
            j = atendentes.length;
          }

        }

      }

    }, 10000);
  }

  finalizarchat(message: any) {
    let atf = []
    for (let i = 0; i < atendimentoRun.length; i++) {
      if (atendimentoRun[i].from == message.from) {
        for (let j = 0; j < atendentes.length; j++) {
          if (atendentes[j].id == atendimentoRun[i].to) {
            atendentes[j].atendimentos.splice(atendentes[j].atendimentos.indexOf(message.from), 1);
            this.setAnalistaLivre(j)
            j = atendentes.length
          }
        }
        atendimentoRun.splice(i, 1);
        i = atendimentoRun.length;
      }
    }
    //bot 
    finalizar({ from: message.from });
    const currentStage = getStage({ from: message.from });
    const messageResponse = stages[currentStage].stage.exec({
      from: message.from,
      message: message.body,
      client: message.from
    });
    if (messageResponse !== undefined) {
      clientS.sendText(message.from, messageResponse).then(() => {
        console.log('Message sent.');
      }).catch(error => console.error('Error when sending message', error));
    } else {
      this.gateway.server.emit('msgToClient', { message });
    }

  }
}
