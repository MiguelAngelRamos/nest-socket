// src/gateways/chat.gateway.ts
import { Logger } from '@nestjs/common';
import {ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/services/chat.service';

@WebSocketGateway({
  cors:  {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true
  }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection,
 OnGatewayDisconnect {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway')

  constructor(private readonly chatService: ChatService) {}
  
  afterInit(server: any) {
    this.logger.log('Init Gateway');
  }
  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.sendMessages(client);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
 

  // Metodo que se va ejecutar cuando recibamos un mensaje del cliente
  // @SubscribeMessage('message')
  // handleMessage(@MessageBody() message: string, @ConnectedSocket() cliente: Socket): void {

  // }

  // Otro metodo para enviar un mensaje al cliente
  private sendMessages(client: Socket) {
    this.chatService.getMessages().subscribe(messages => {
      client.emit('messages', messages);
    })
  }


}