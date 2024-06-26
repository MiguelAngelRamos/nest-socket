// src/gateways/chat.gateway.ts

// Importación de Logger desde @nestjs/common para el registro de eventos.
import { Logger } from '@nestjs/common';

// Importaciones necesarias desde @nestjs/websockets para la configuración del gateway WebSocket.
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

// Importación de Server y Socket desde socket.io para trabajar con los clientes WebSocket.
import { Server, Socket } from 'socket.io';

// Importación del servicio de chat desde la carpeta de servicios.
import { ChatService } from 'src/services/chat.service';

// Decorador para configurar el gateway WebSocket.
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200', // Permitir solicitudes desde esta URL específica.
    methods: ['GET', 'POST'], // Métodos HTTP permitidos.
    credentials: true // Permitir el uso de credenciales.
  }
})
// Definición de la clase ChatGateway que implementa las interfaces OnGatewayInit, OnGatewayConnection, y OnGatewayDisconnect.
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
  // Declaración del servidor WebSocket.
  @WebSocketServer() server: Server;
  
  // Creación de una instancia de Logger con el contexto 'ChatGateway'.
  private logger: Logger = new Logger('ChatGateway');

  // Inyección del servicio de chat mediante el constructor.
  constructor(private readonly chatService: ChatService) {}

  // Método que se ejecuta después de que se inicializa el gateway.
  afterInit(server: any) {
    this.logger.log('Init Gateway'); // Registro de la inicialización del gateway.
  }

  // Método que maneja la conexión de un cliente.
  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`); // Registro de la conexión del cliente.
    this.sendWindowedMessages(client, 3000); // Envío de mensajes en buffer al cliente con un tiempo de buffer de 3000 ms (3 segundos).
  }

  // Método que maneja la desconexión de un cliente.
  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`); // Registro de la desconexión del cliente.
  }

  // Decorador para suscribirse a los mensajes etiquetados como 'messages'.
  @SubscribeMessage('messages')
  // Método que maneja los mensajes recibidos.
  handleMessage(@MessageBody() message: string): void {
    this.chatService.saveMessage(message); // Guardar el mensaje utilizando el servicio de chat.
    this.server.emit('messages', message); // Emitir el mensaje a todos los clientes conectados.
  }

  // Método privado para enviar mensajes en ventanas de tiempo específicas al cliente.
  private sendWindowedMessages(client: Socket, bufferTimeMs: number) {
    this.chatService.getWindowedMessages(bufferTimeMs).subscribe(messages => {
      if (messages.length > 0) { // Verificar si hay mensajes en el buffer.
        client.emit('windowedMessages', messages); // Emitir los mensajes en buffer al cliente.
      }
    });
  }
}
