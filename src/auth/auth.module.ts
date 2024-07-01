import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';


@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    
    ConfigModule,
    TypeOrmModule.forFeature([User]),
  PassportModule.register({defaultStrategy: 'jwt'}),

  // inject service ConfigService from ConfigModule
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory:(configService: ConfigService) => {
      //with config service : datatype , validation function, set valor por defecto. better environment variables
      // console.log ('JWT Secret', configService.get('JWT_SECRET'))
      // console.log('JWT_SECRET', process.env.JWT_SECRET)
    
      return {
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '2h'
        }
      }
    }
  })

  // JwtModule.register({
  //   // secret: '321432423',
  //   secret: process.env.JWT_SECRET,
  //   signOptions: {
  //     expiresIn: '2h'
  //   }
  // })
  // bettermake this asynchronus

],
  // this export the config made above.
  exports: [TypeOrmModule],
})
export class AuthModule {}
