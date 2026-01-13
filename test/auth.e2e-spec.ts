import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common'
import {
  Test,
  TestingModule,
} from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from 'src/app.module'
import { Server } from 'http'
import { clearDatabase } from './helpers/clear-data-base'
import { DataSource } from 'typeorm'
import { createUserAndLogin } from './helpers/create-user-and-login'

interface HttpValidationErrorResponse {
  statusCode: number
  message: string[]
  error: string
}

describe('AuthController (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let server: Server

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile()

    app =
      moduleFixture.createNestApplication()

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )

    await app.init()

    server =
      app.getHttpServer() as Server

    dataSource = app.get(DataSource)
  })

  afterEach(async () => {
    await clearDatabase(dataSource)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should authenticate and return token', async () => {
    const token =
      await createUserAndLogin(server)

    expect(typeof token).toBe('string')
  })

  it('should access protected route', async () => {
    const token =
      await createUserAndLogin(server)

    await request(server)
      .get('/recipes')
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .expect(200)
  })

  it('should fail if email is invalid', async () => {
    const response = await request(
      server,
    )
      .post('/auth')
      .send({
        email: 'email-invalido',
        password: '123456',
      })
      .expect(400)

    const body =
      response.body as HttpValidationErrorResponse

    expect(body.message).toContain(
      'email must be an email',
    )
  })

  it('should fail if the password is short password', async () => {
    const response = await request(
      server,
    )
      .post('/auth')
      .send({
        email: 'johndoe@gmail.com',
        password: '12345',
      })
      .expect(400)

    const body =
      response.body as HttpValidationErrorResponse

    expect(body.message).toContain(
      'password must be longer than or equal to 6 characters',
    )
  })

  it('should fail if the body is empty', async () => {
    await request(server)
      .post('/auth')
      .send({})
      .expect(400)
  })
})
