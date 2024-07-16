
import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

interface ConnectClients {
    // socket id point to the socket instance. we have identify the socket by id and the user
    // this is recommended to save in database when we have a lot of users, but I'm going to save in memory to be more fast in a little users
    [id: string]: {
        socket: Socket,
        user: User,
    };

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

    constructor(
        // this also could be implemented in the service of the users, but I'm going to inject directly here
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async registerClient(client: Socket, userId: string) {

        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) throw new Error('User not found');
        if (!user.isActive) throw new Error('User is not active');

        //clie nt id points to the socket instance that come from parameter
        this.connectedClients[client.id] = {
            socket: client,
            user: user, // or only user

        };
    }

    removedClient(clientId: string) {
        delete this.connectedClients[clientId];
    }


    // return id of clients connected
    getConnectedClients(): string[] {
        console.log(this.connectedClients);
        return Object.keys(this.connectedClients);

    }

    getUserFullNameSocketId(socketId: string) {
        return this.connectedClients[socketId].user.fullName;
    }

    // getConnectedClients(): number {
    //      return Object.keys(this.connectedClients).length;

    // }

}
