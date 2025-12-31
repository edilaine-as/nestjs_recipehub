import { User } from './user.entity'

describe('UserEntity', () => {
  it('should create a user with hashed password', async () => {
    const user = await User.create({
      email: 'dila@gmail.com',
      name: 'dila',
      password: '123456',
    })

    expect(user.getId()).toBeDefined()
    expect(user.getPassword()).not.toBe(
      '123456',
    )
  })

  it('should compare password', async () => {
    const user = await User.create({
      email: 'dila@gmail.com',
      name: 'dila',
      password: '123456',
    })

    const success =
      await user.comparePassword(
        '123456',
      )
    const fail =
      await user.comparePassword(
        '234803',
      )

    expect(success).toBe(true)
    expect(fail).toBe(false)
  })

  it('should restore user without changing data', () => {
    const date = new Date('2025-01-01')

    const user = User.restore({
      id: '1',
      name: 'dila',
      email: 'dila@gmail.com',
      passwordHash: 'hashed-password',
      createdAt: date,
      updatedAt: date,
    })

    expect(user.getId()).toBe('1')
    expect(user.getName()).toBe('dila')
  })

  it('should update password and updateAt', async () => {
    const user = await User.create({
      email: 'dila@gmail.com',
      name: 'dila',
      password: '123456',
    })

    const oldUpdatedAt =
      user.getUpdatedAt()

    await new Promise<void>(
      (resolve) => {
        setTimeout(() => {
          resolve()
        }, 10)
      },
    )

    await user.setPassword(
      'newpassword',
    )

    const isNewPassword =
      await user.comparePassword(
        'newpassword',
      )
    expect(isNewPassword).toBe(true)
    expect(
      user.getUpdatedAt().getTime(),
    ).toBeGreaterThan(
      oldUpdatedAt.getTime(),
    )
  })

  it('should update name and updateAt', async () => {
    const user = await User.create({
      email: 'dila@gmail.com',
      name: 'dila',
      password: '123456',
    })

    const oldUpdatedAt =
      user.getUpdatedAt()

    await new Promise<void>(
      (resolve) => {
        setTimeout(() => {
          resolve()
        }, 10)
      },
    )

    user.setName('Edilaine')

    expect(user.getName()).toBe(
      'Edilaine',
    )
    expect(
      user.getUpdatedAt().getTime(),
    ).toBeGreaterThan(
      oldUpdatedAt.getTime(),
    )
  })

  it('should update email and updateAt', async () => {
    const user = await User.create({
      email: 'dila@gmail.com',
      name: 'dila',
      password: '123456',
    })

    const oldUpdatedAt =
      user.getUpdatedAt()

    await new Promise<void>(
      (resolve) => {
        setTimeout(() => {
          resolve()
        }, 10)
      },
    )

    user.setEmail('dila@example.com')

    expect(user.getEmail()).toBe(
      'dila@example.com',
    )
    expect(
      user.getUpdatedAt().getTime(),
    ).toBeGreaterThan(
      oldUpdatedAt.getTime(),
    )
  })
})
