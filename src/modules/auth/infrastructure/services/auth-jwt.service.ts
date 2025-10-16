import { Injectable } from '@nestjs/common'
import { JwtService as NestJwtService } from '@nestjs/jwt'
import { JwtPayloadDto } from '../../shared/dto/jwt-payload.dto'

@Injectable()
export class AuthJwtService {
  constructor(
    private readonly jwtService: NestJwtService,
  ) {}

  generateToken(
    payload: JwtPayloadDto,
  ): string {
    return this.jwtService.sign(payload)
  }

  verifyToken(
    token: string,
  ): JwtPayloadDto {
    return this.jwtService.verify(token)
  }
}
