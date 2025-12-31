import { UserRepositoryInMemory } from '../../tests/repositories/user.repository.in-memory'
import { CreateUserUseCase } from './create-user.use-case'

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase
  let repository: UserRepositoryInMemory

  beforeEach(() => {
    repository =
      new UserRepositoryInMemory()
    useCase = new CreateUserUseCase(
      repository,
    )
  })

  it('should create and persist a user', async () => {
    const user = await useCase.execute({
      name: 'dila',
      email: 'dila@gmail.com',
      password: '123456',
    })

    const storedUser =
      await repository.findByEmail(
        'dila@gmail.com',
      )

    expect(storedUser).not.toBeNull()
    expect(storedUser?.getId()).toBe(
      user.getId(),
    )
  })

  it('should not allow duplicate email', async () => {
    await useCase.execute({
      name: 'dila',
      email: 'dila@gmail.com',
      password: '123456',
    })

    await expect(
      useCase.execute({
        name: 'dila',
        email: 'dila@gmail.com',
        password: '123456',
      }),
    ).rejects.toThrow()
  })
})
