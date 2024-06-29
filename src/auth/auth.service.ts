import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt'

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      return user;
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

    return user ;
    // retornar 

  }


  private handleDBError(error: any): never {
   
   if (error.code === '23505') {
    throw new BadRequestException(error.detail);
  }
  console.log(error);
   
  throw new InternalServerErrorException(`Please check server logs`);
  }


} 
