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


    // add client to a room
    //client.join('ventas')
    // also client can join to multiple rooms
    //client.join(client.id)
    // could use the email of the user as a identifier of the room
    // client.join('email')
    //send message to all clients connected to the room
    //this.wss.to('ventas').emit('')

    // console.log({ conectados: this.messagesWsService.getConnectedClients() });
  }


  handleDisconnect(client: Socket) {
    // console.log('client disconnected', client.id);
    this.messagesWsService.removedClient(client.id);
    // console.log({ conectados: this.messagesWsService.getConnectedClients() });
  }

  // this could be saved in database. this could be asynchronus, but I'm going to do it synchronously. still the connection could be asynchronus

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    // console.log(client.id, payload);

    // message-from-server (only send to the client that emit the message)
    //! Emite unicamente al cliente.
    // client.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message : payload.message || 'no-message'
    // });

    // message-to-clients (send to all clients connected)
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no-message'
    // });

    // add client to room 
    // this.wss.to('clientID')

    this.wss.emit('message-from-server', {
      fullName: 'Soy Yo!',
      message: payload.message || 'no-message'
    })

  }

}



