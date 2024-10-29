import { UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '../guards/authGuard';

export const AuthGuard = () => UseGuards(AuthenticationGuard);
