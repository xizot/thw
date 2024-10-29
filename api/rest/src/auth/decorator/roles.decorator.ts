import { UseGuards } from '@nestjs/common';
import Role from '../guards/rolesGuard';
import { Permission } from 'shop-shared/dist/auth';

export const RolesGuard = (...requiredPermissions: Permission[]) =>
  UseGuards(Role(...requiredPermissions));
