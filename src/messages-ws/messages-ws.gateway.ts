import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private readonly messagesWsService: MessagesWsService
  ) { }

  handleConnection(client: Socket) {
    // console.log('client connected', client.id);
    this.messagesWsService.registerClient(client);

    console.log({ conectados: this.messagesWsService.getConnectedClients() });
  }
  
  
  handleDisconnect(client: Socket) {
    // console.log('client disconnected', client.id);
    this.messagesWsService.removedClient(client.id);
    console.log({ conectados: this.messagesWsService.getConnectedClients() });
  }


}



