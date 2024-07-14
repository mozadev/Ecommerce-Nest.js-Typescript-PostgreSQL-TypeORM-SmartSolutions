import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';


@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server; // this have got information all clients connected

  constructor(
    private readonly messagesWsService: MessagesWsService
  ) { }

  handleConnection(client: Socket) {
    // console.log('client connected', client.id);
    this.messagesWsService.registerClient(client);

    // send to all clients connected the list of clients connected as a payload
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
    // console.log({ conectados: this.messagesWsService.getConnectedClients() });
  }


  handleDisconnect(client: Socket) {
    // console.log('client disconnected', client.id);
    this.messagesWsService.removedClient(client.id);
    // console.log({ conectados: this.messagesWsService.getConnectedClients() });
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log(client.id, payload);

  }

}



