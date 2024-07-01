import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interfaces";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from '@nestjs/config';
import { IsEmail } from 'class-validator';
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  
        })
    }

    //this method won't be called if jwt token haven't expired  and the signature match with payload
    async validate(payload: JwtPayload): Promise<User> {

        const { email } = payload;
        const user = await this.userRepository.findOneBy({ email });

        if (!user)
            throw new UnauthorizedException('Token not valid')
        
        if(!user.isActive)
            throw new UnauthorizedException('User is inactive , talk with an admin')
             
        return user;

    }


}