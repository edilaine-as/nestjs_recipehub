/* eslint-disable @typescript-eslint/require-await */

import { User } from '../../domain/entities/user.entity'
import { UserRepository } from '../../domain/repositories/user.repository'

export class UserRepositoryInMemory
  implements UserRepository
{
  private users: User[] = []

  async save(
    user: User,
  ): Promise<void> {
    const index = this.users.findIndex(
      (u) => u.getId() === user.getId(),
    )

    if (index >= 0) {
      this.users[index] = user
      return
    }

    this.users.push(user)
  }

  async findAll(): Promise<User[]> {
    return this.users ?? null
  }

  async findByEmail(
    email: string,
  ): Promise<User | null> {
    return (
      this.users.find(
        (user) =>
          user.getEmail() === email,
      ) ?? null
    )
  }

  async findById(
    id: string,
  ): Promise<User | null> {
    return (
      this.users.find(
        (user) => user.getId() === id,
      ) ?? null
    )
  }
}
