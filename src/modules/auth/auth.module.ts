import { Module } from '@nestjs/common'

import { AuthController } from './interface/auth.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config'
import { UsersModule } from '../users/users.module'
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy'
import { LoginUseCase } from './application/use-cases/login.use-case'
import { AuthJwtService } from './infrastructure/services/auth-jwt.service'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ) => ({
        secret:
          configService.get<string>(
            'JWT_SECRET',
          )!,
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthJwtService,
    JwtStrategy,
    LoginUseCase,
  ],
})
export class AuthModule {}
