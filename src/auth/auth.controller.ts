import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';


import { CreateUserDto, LoginUserDto } from './dto';
import { ok } from 'assert';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  LoginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute() {
    return {
      ok: true,
      message: 'Hola Mundo private!',
      user: { name: 'cesar' }
    }
  }
  // TOKEN is the same saved local storage, sesion storage
  // storage phisical device (cookie, local storage, session storage)
  // us strategy use by default UseGuards(AuthGuard('jwt'))


}
