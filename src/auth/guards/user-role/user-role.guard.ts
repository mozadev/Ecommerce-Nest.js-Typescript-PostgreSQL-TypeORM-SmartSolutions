import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    // private readonly reflector: Ref
    private readonly reflector:  Reflector
  ) {}


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // overwritting the default behavior
    // throw new BadRequestException('You are not an admin')
    // console.log('UserRoleGuard')

    const validRoles = this.reflector.get('roles', context.getHandler())
    console.log({validRoles})

    return true;
  }
}

// this guard will ensure that the user has the roles specified in the metadata