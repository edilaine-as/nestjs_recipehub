import {
  ConflictException,
  Inject,
  NotFoundException,
} from '@nestjs/common'
import { User } from '../../domain/entities/user.entity'
import type { UserRepository } from '../../domain/repositories/user.repository'

interface UpdateUserInput {
  name?: string
  email?: string
  password?: string
}

export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateUserInput,
  ): Promise<User> {
    const user =
      await this.userRepository.findById(
        id,
      )

    if (!user) {
      throw new NotFoundException(
        'User not found',
      )
    }

    const { name, email, password } =
      input

    if (
      name &&
      name !== user.getName()
    ) {
      user.setName(name)
    }

    if (password) {
      await user.setPassword(password)
    }

    if (
      email &&
      email !== user.getEmail()
    ) {
      const userWithEmail =
        await this.userRepository.findByEmail(
          email,
        )
      if (userWithEmail) {
        throw new ConflictException(
          'Email is already in use',
        )
      }
      user.setEmail(email)
    }

    await this.userRepository.save(user)

    return user
  }
}
