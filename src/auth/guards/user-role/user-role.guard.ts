import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    // private readonly reflector: Ref
    private readonly reflector: Reflector
  ) { }


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // overwritting the default behavior
    // throw new BadRequestException('You are not an admin')
    // console.log('UserRoleGuard')

    const validRoles = this.reflector.get(META_ROLES, context.getHandler())
    console.log({ validRoles })

    if (!validRoles) return true;
    if (validRoles.length === 0) return true

    // console.log({ validRoles })

    // taken user fron custom decorator
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    //  if someone is trying to use UserRoleGuard without using AuthGuard of authentication, the user will be undefined. this guard set user in the header. it gets error. We need grab the user from the request
    //  @SetMetadata('roles', ['admin', 'super-user'])
    //@UseGuards(AuthGuard(), UserRoleGuard)
    if (!user) {
      throw new BadRequestException('User not found (guard)')
    }

    // console.log({ userRoles: user.roles })

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `User ${user.fullName} need a valid role [${validRoles}]`
    )

  }
}

// this guard will ensure that the user has the roles specified in the metadata