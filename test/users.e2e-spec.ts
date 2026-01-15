/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common'
import {
  Test,
  TestingModule,
} from '@nestjs/testing'
import { Server } from 'http'
import request from 'supertest'
import { AppModule } from 'src/app.module'
import { DataSource } from 'typeorm'
import { clearDatabase } from './helpers/clear-data-base'
import { createUserAndLogin } from './helpers/create-user-and-login'

describe('IngredientsController (e2e)', () => {
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

  it('should create a user', async () => {
    const response = await request(
      server,
    )
      .post('/users')

      .send({
        name: 'Edilaine',
        email:
          'edilaine.example@gmail.com',
        password: '123456',
      })
      .expect(201)

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Edilaine',
        email:
          'edilaine.example@gmail.com',
      }),
    )
  })

  it('should update a user', async () => {
    const token =
      await createUserAndLogin(server)

    const response = await request(
      server,
    )
      .put(`/users`)
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        name: 'Edilaine Santos',
      })

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Edilaine Santos',
      }),
    )
  })
})
