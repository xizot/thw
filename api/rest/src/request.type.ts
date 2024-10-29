import { AuthPayloadResponse } from 'shop-shared/dist/auth';

declare module 'express' {
  export interface Request {
    user?: AuthPayloadResponse;
  }
}
