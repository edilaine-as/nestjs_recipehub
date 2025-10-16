import type { UserRepository } from 'src/modules/users/domain/repositories/user.repository'

import {
  Inject,
  Injectable,
} from '@nestjs/common'
import { AuthJwtService } from '../../infrastructure/services/auth-jwt.service'

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly authService: AuthJwtService,
  ) {}

  async execute(
    email: string,
    password: string,
  ) {
    const user =
      await this.userRepository.findByEmail(
        email,
      )

    if (!user) {
      throw new Error('User not found')
    }

    const isPasswordValid =
      await user.comparePassword(
        password,
      )

    if (!isPasswordValid) {
      throw new Error(
        'Invalid password',
      )
    }

    const token =
      this.authService.generateToken({
        userId: user.getId(),
        email: email,
      })

    return { token }
  }
}
