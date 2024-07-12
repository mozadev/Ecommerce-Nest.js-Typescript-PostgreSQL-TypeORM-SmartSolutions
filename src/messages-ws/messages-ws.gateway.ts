import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({cors: true, namespace: 'messages' })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly messagesWsService: MessagesWsService) { }
  
  handleDisconnect(client: Socket) {
console.log('client disconnected', client.id);
  }

  handleConnection(client: Socket) {
console.log('client connected', client.id );
  }
}
