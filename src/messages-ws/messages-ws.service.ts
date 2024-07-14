
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectClients {
    // socket id point to the socket instance
    [id: string]: Socket;

    // I haven't got limit of clients connected, also I can be save on database but it's volatile when reload the browser
    // example id of client and socket instance
    // 'sfsfdsusuario1': socket
    // 'sfsfdsusuario2': socket
    // 'sfsfdsa.....3': socket
    // 'sfsfdsa.....4': socket

}

@Injectable()
export class MessagesWsService {

    private connectedClients: ConnectClients = {};

    registerClient(client: Socket) {
        //clie nt id points to the socket instance that come from parameter
        this.connectedClients[client.id] = client;  
    }

    removedClient(clientId: string) {
        delete this.connectedClients[clientId];
    }

    getConnectedClients(): number {
        return Object.keys(this.connectedClients).length;
    }

}
