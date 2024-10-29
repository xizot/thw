import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadResponse } from 'shop-shared/dist/auth';
import { AuthService } from '../auth.service';

@Injectable()
export class JsonWebTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_KEY,
    });
  }
  async validate(payload: AuthPayloadResponse): Promise<AuthPayloadResponse> {
    const user = await this.authService.validateUser(payload);
    if (!user) throw new UnauthorizedException();

    return {
      permissions: user.permissions,
      username: user.username,
      email: payload.email,
      id: payload.id,
    };
  }
}
