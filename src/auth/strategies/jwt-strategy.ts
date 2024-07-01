import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interfaces";


export class JwtStrategy extends PassportStrategy(Strategy) {

    //this method won't be called if jwt token haven't expired  and the signature match with payload
async validate (payload: JwtPayload ): Promise<User> {




    const {email } = payload;


return ;
    
}


}