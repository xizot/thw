import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  mixin,
  Type,
} from '@nestjs/common';
import { Permission } from 'shop-shared/dist/auth';

const Role = (...requiredPermissions: Permission[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const { user } = context.switchToHttp().getRequest();
      const userPermissions = user?.permissions || [];

      const hasPermission = this.matchPermissions(
        requiredPermissions,
        userPermissions,
      );

      if (!hasPermission) {
        throw new ForbiddenException(
          'You do not have permission to access this resource.',
        );
      }

      return true;
    }

    private matchPermissions(
      requiredPermissions: Permission[],
      userPermissions: Permission[],
    ): boolean {
      return requiredPermissions.some((permission) =>
        userPermissions.includes(permission),
      );
    }
  }

  return mixin(RoleGuardMixin);
};

export default Role;
