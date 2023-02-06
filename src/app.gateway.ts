import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  
  // @Inject(AppService)
  // public service : AppService 
  constructor(public service: AppService){
    
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: any): void {
    this.service.sendMensage({...payload})
    // this.server.emit('msgToClient', payload, client.id);
  }
  @SubscribeMessage('disponivel')
  atendenteDisponivel(client: Socket, payload: any): void {
    this.service.atendenteDisponivel({payload})
    // this.server.emit('msgToClient', payload, client.id);
  }

  @SubscribeMessage('finalizarchat')
  finalMessage(client: Socket, payload: any): void {
    this.service.finalizarchat({...payload})
    // this.server.emit('msgToClient', payload, client.id);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    this.logger.log( `Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log( `Client disconnected: ${client.id}`);
  }
}