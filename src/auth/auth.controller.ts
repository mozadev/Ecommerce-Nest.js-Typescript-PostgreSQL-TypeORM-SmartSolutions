import { Controller, Get, Post, Body, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';


import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, RawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';


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
  testingPrivateRoute(
    //  @GetUser(['email', 'role', 'fullName']) user: User
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {

    // console.log({ request })

    // !user.roles.includes('admin') throw new Error('You are not an admin')
    !user.roles.includes('admin') && console.log('You are not an admin')
    return {
      ok: true,
      message: 'Hola Mundo private!',
      // user: { name: 'cesar' }
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }
  //this a response of private rute
  // TOKEN is the same saved local storage, sesion storage
  // storage phisical device (cookie, local storage, session storage)
  // us strategy use by default UseGuards(AuthGuard('jwt'))
  // @SetMetadata('roles', ['admin', 'super-user'])

  @Get('private2')
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }

  }

}
