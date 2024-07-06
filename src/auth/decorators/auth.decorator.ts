import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';

export function Auth(...roles: ValidRoles[]) {
    return applyDecorators(

        // RoleProtected(ValidRoles.superUser, ValidRoles.admin),...roles means that we can pass multiple roles to the decorator
         RoleProtected(...roles),
        UseGuards(AuthGuard(), UserRoleGuard),

    );
} 