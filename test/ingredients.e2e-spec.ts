/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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

  beforeEach(async () => {
    await clearDatabase(dataSource)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should get ingredient by id', async () => {
    const token =
      await createUserAndLogin(server)

    const createResponse =
      await request(server)
        .post('/ingredients')
        .set(
          'Authorization',
          `Bearer ${token}`,
        )
        .send({
          name: 'milk',
          type: 'dairy',
        })

    const ingredientId =
      createResponse.body.id

    const response = await request(
      server,
    )
      .get(
        `/ingredients/${ingredientId}`,
      )
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .expect(200)

    expect(response.body).toEqual(
      expect.objectContaining({
        id: ingredientId,
        name: 'milk',
        type: 'dairy',
      }),
    )
  })

  it('should get all ingredients', async () => {
    const token =
      await createUserAndLogin(server)

    const createResponse1 =
      await request(server)
        .post('/ingredients')
        .set(
          'Authorization',
          `Bearer ${token}`,
        )
        .send({
          name: 'milk',
          type: 'dairy',
        })

    const createResponse2 =
      await request(server)
        .post('/ingredients')
        .set(
          'Authorization',
          `Bearer ${token}`,
        )
        .send({
          name: 'oil',
          type: 'fats_and_oils',
        })

    const ingredientId1 =
      createResponse1.body.id
    const ingredientId2 =
      createResponse2.body.id

    const response = await request(
      server,
    )
      .get(`/ingredients`)
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .expect(200)

    expect(response.body).toHaveLength(
      2,
    )
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: ingredientId1,
        }),
        expect.objectContaining({
          id: ingredientId2,
        }),
      ]),
    )
  })

  it('should create a ingredient', async () => {
    const token =
      await createUserAndLogin(server)

    const response = await request(
      server,
    )
      .post('/ingredients')
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        name: 'milk',
        type: 'dairy',
      })
      .expect(201)

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'milk',
        type: 'dairy',
      }),
    )
  })

  it('should update a ingredient', async () => {
    const token =
      await createUserAndLogin(server)

    const createResponse =
      await request(server)
        .post('/ingredients')
        .set(
          'Authorization',
          `Bearer ${token}`,
        )
        .send({
          name: 'milk',
          type: 'dairy',
        })

    const ingredientId =
      createResponse.body.id

    const response = await request(
      server,
    )
      .patch(
        `/ingredients/${ingredientId}`,
      )
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        name: 'leite',
      })
      .expect(200)

    expect(response.body).toEqual(
      expect.objectContaining({
        id: ingredientId,
        name: 'leite',
        type: 'dairy',
        userId: expect.any(String),
      }),
    )
  })

  it('should delete a ingredient', async () => {
    const token =
      await createUserAndLogin(server)

    const createResponse =
      await request(server)
        .post('/ingredients')
        .set(
          'Authorization',
          `Bearer ${token}`,
        )
        .send({
          name: 'milk',
          type: 'dairy',
        })

    const ingredientId =
      createResponse.body.id

    const response = await request(
      server,
    )
      .delete(
        `/ingredients/${ingredientId}`,
      )
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .expect(200)

    expect(response.body.message).toBe(
      'Ingredient deleted successfully',
    )
  })
})
