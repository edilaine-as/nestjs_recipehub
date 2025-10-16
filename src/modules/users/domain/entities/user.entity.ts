import { v4 as uuidv4 } from 'uuid'
import * as bcrypt from 'bcrypt'

export class User {
  private readonly id: string
  private name: string
  private email: string
  private password: string
  private readonly createdAt: Date
  private updatedAt: Date

  private constructor(
    name: string,
    email: string,
    password: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.name = name
    this.email = email
    this.password = password
    this.id = id ?? uuidv4()
    this.createdAt =
      createdAt ?? new Date()
    this.updatedAt =
      updatedAt ?? new Date()
  }

  static async create(props: {
    name: string
    email: string
    password: string
  }) {
    const hash = await bcrypt.hash(
      props.password,
      10,
    )
    return new User(
      props.name,
      props.email,
      hash,
    )
  }

  async comparePassword(
    plainText: string,
  ): Promise<boolean> {
    return bcrypt.compare(
      plainText,
      this.password,
    )
  }

  static restore(props: {
    id: string
    name: string
    email: string
    passwordHash: string
    createdAt: Date
    updatedAt: Date
  }): User {
    return new User(
      props.name,
      props.email,
      props.passwordHash,
      props.id,
      props.createdAt,
      props.updatedAt,
    )
  }

  private touchUpdatedAt() {
    this.updatedAt = new Date()
  }

  setName(newName: string) {
    this.name = newName
    this.touchUpdatedAt()
  }

  setEmail(newEmail: string) {
    this.email = newEmail
    this.touchUpdatedAt()
  }

  async setPassword(
    newPassword: string,
  ) {
    const hash = await bcrypt.hash(
      newPassword,
      10,
    )

    this.password = hash
    this.touchUpdatedAt()
  }

  getId(): string {
    return this.id
  }

  getName(): string {
    return this.name
  }

  getEmail(): string {
    return this.email
  }

  getPassword(): string {
    return this.password
  }

  getCreatedAt(): Date {
    return this.createdAt ?? new Date()
  }

  getUpdatedAt(): Date {
    return this.updatedAt ?? new Date()
  }
}
