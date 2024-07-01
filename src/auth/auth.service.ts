import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt'

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // this is provided by JwtModule.registerAsync... in auth.module.ts. This tell us expiration time, secret, etc, key to firm the token, how lon it is
    private readonly jwtService: JwtService
  ) {}


  async create(createUserDto: CreateUserDto) {

    try {

      const {password, ...userData} = createUserDto;

      const user = this.userRepository.create(

        {
          ...userData,
          password: bcrypt.hashSync(password, 10)
        }
      );

      await this.userRepository.save(user);
      delete user.password;
      
      return {
        ...user,
        token: this.getJWtToken({email: user.email})    
      
      } ;
      // TODO: Return the JWT token

    }catch (error) {
      this.handleDBError(error);
    }

  }

  async login(LoginUserDto:LoginUserDto) {

   
    const {password, email} = LoginUserDto;

    const user = await this.userRepository.findOne({
    
      // email is unique and it's indexed
      where: {email},
      select:  {email: true, password: true}

    })

    if(!user){
      throw new UnauthorizedException('Credentials are not valid (email)')/*  */
    }

    if (!bcrypt.compareSync(password, user.password)){
      throw new UnauthorizedException('Credentials are not valid (password)')
    }

    return {
      ...user,
      token: this.getJWtToken({email: user.email})    
    
    } ;
    // TODO : retornar  EL JWT token
  


  }

  private getJWtToken(payload: JwtPayload){

    const token = this.jwtService.sign(payload);
    return token;
    
  }


  private handleDBError(error: any): never {
   
   if (error.code === '23505') {
    throw new BadRequestException(error.detail);
  }
  console.log(error);
   
  throw new InternalServerErrorException(`Please check server logs`);
  }


} 
