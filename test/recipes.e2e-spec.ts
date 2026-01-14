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
import request from 'supertest'
import { AppModule } from 'src/app.module'
import { Server } from 'http'
import { DataSource } from 'typeorm'
import { clearDatabase } from './helpers/clear-data-base'
import { createUserAndLogin } from './helpers/create-user-and-login'

describe('RecipesController (e2e)', () => {
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

  it('should get recipe by id', async () => {
    const token =
      await createUserAndLogin(server)

    const createResponse =
      await request(server)
        .post('/recipes')
        .set(
          'Authorization',
          `Bearer ${token}`,
        )
        .send({
          title: 'bolo',
          category: 'dessert',
        })

    const recipeId =
      createResponse.body.id

    const response = await request(
      server,
    )
      .get(`/recipes/${recipeId}`)
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .expect(200)

    expect(response.body).toEqual(
      expect.objectContaining({
        id: recipeId,
        title: 'bolo',
        category: 'dessert',
        ingredients: [],
        steps: [],
      }),
    )
  })

  it('should get recipe by id', async () => {
    const token =
      await createUserAndLogin(server)

    const createResponse =
      await request(server)
        .post('/recipes')
        .set(
          'Authorization',
          `Bearer ${token}`,
        )
        .send({
          title: 'bolo',
          category: 'dessert',
        })

    const recipeId =
      createResponse.body.id

    const response = await request(
      server,
    )
      .get(`/recipes/${recipeId}`)
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .expect(200)

    expect(response.body).toEqual(
      expect.objectContaining({
        id: recipeId,
        title: 'bolo',
        category: 'dessert',
        ingredients: [],
        steps: [],
      }),
    )
  })

  it('should create a recipe', async () => {
    const token =
      await createUserAndLogin(server)

    const response = await request(
      server,
    )
      .post('/recipes')
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        title: 'pudim',
        category: 'dessert',
      })
      .expect(201)

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'pudim',
        category: 'dessert',
        userId: expect.any(String),
      }),
    )
  })

  it('should add ingredient to recipe', async () => {
    const token =
      await createUserAndLogin(server)

    const recipe = await request(server)
      .post('/recipes')
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        title: 'lasagna',
        category: 'main_dish',
      })

    const recipeId = recipe.body.id

    const response = await request(
      server,
    )
      .post(
        `/recipes/${recipeId}/ingredients`,
      )
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        name: 'Cheese',
        type: 'dairy',
        quantity: 200,
        unit: 'gram',
      })
      .expect(201)

    expect(response.body.message).toBe(
      'Ingredient added successfully',
    )
  })

  it('should throw an error if ingredient already exists in the recipe', async () => {
    const token =
      await createUserAndLogin(server)

    const recipe = await request(server)
      .post('/recipes')
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        title: 'lasagna',
        category: 'main_dish',
      })

    const recipeId = recipe.body.id

    await request(server)
      .post(
        `/recipes/${recipeId}/ingredients`,
      )
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        name: 'Cheese',
        type: 'dairy',
        quantity: 200,
        unit: 'gram',
      })
      .expect(201)

    const response = await request(
      server,
    )
      .post(
        `/recipes/${recipeId}/ingredients`,
      )
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        name: 'Cheese',
        type: 'dairy',
        quantity: 200,
        unit: 'gram',
      })
      .expect(409)

    expect(response.body.message).toBe(
      'Ingredient already exists in this recipe.',
    )
  })

  it('should add step to recipe', async () => {
    const token =
      await createUserAndLogin(server)

    const recipe = await request(server)
      .post('/recipes')
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        title: 'lasagna',
        category: 'main_dish',
      })

    const recipeId = recipe.body.id

    const response = await request(
      server,
    )
      .post(
        `/recipes/${recipeId}/steps`,
      )
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        step: 1,
        description: 'Passo 1',
      })
      .expect(201)

    expect(response.body.message).toBe(
      'Step added successfully',
    )
  })

  it('should throw an error if the step already exists in the recipe', async () => {
    const token =
      await createUserAndLogin(server)

    const recipe = await request(server)
      .post('/recipes')
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        title: 'lasagna',
        category: 'main_dish',
      })

    const recipeId = recipe.body.id

    await request(server)
      .post(
        `/recipes/${recipeId}/steps`,
      )
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        step: 1,
        description: 'Passo 1',
      })
      .expect(201)

    const response = await request(
      server,
    )
      .post(
        `/recipes/${recipeId}/steps`,
      )
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        step: 1,
        description: 'Passo 1',
      })
      .expect(409)

    expect(response.body.message).toBe(
      'Step already exists in this recipe.',
    )
  })

  it('should update a recipe', async () => {
    const token =
      await createUserAndLogin(server)

    const recipe = await request(server)
      .post('/recipes')
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        title: 'lasagna',
        category: 'main_dish',
      })

    const recipeId = recipe.body.id

    const response = await request(
      server,
    )
      .put(`/recipes/${recipeId}`)
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        title: 'Lasanha',
      })
      .expect(200)

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Lasanha',
        category: 'main_dish',
        userId: expect.any(String),
      }),
    )
  })

  it('should update recipe ingredient', async () => {
    const token =
      await createUserAndLogin(server)

    const recipe = await request(server)
      .post('/recipes')
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        title: 'lasagna',
        category: 'main_dish',
      })

    const recipeId = recipe.body.id

    const recipeIngredient =
      await request(server)
        .post(
          `/recipes/${recipeId}/ingredients`,
        )
        .set(
          'Authorization',
          `Bearer ${token}`,
        )
        .send({
          name: 'Cheese',
          type: 'dairy',
          quantity: 200,
          unit: 'gram',
        })

    const recipeIngredientId =
      recipeIngredient.body.ingredient
        .id

    const response = await request(
      server,
    )
      .put(
        `/recipes/${recipeIngredientId}/ingredients`,
      )
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        unit: 'milliliter',
      })
      .expect(200)

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        quantity: 200,
        unit: 'milliliter',
        ingredient: {
          id: expect.any(String),
          name: 'Cheese',
          type: 'dairy',
        },
        recipe: {
          id: expect.any(String),
          title: 'lasagna',
          category: 'main_dish',
          userId: expect.any(String),
        },
      }),
    )
  })

  it('should update recipe step', async () => {
    const token =
      await createUserAndLogin(server)

    const recipe = await request(server)
      .post('/recipes')
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        title: 'lasagna',
        category: 'main_dish',
      })

    const recipeId = recipe.body.id

    const recipeStep = await request(
      server,
    )
      .post(
        `/recipes/${recipeId}/steps`,
      )
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        step: 1,
        description: 'Passo 1',
      })

    const recipeStepId =
      recipeStep.body.step.id

    const response = await request(
      server,
    )
      .put(
        `/recipes/${recipeStepId}/steps`,
      )
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        description:
          'Passo 1 atualizado',
      })

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        step: 1,
        description:
          'Passo 1 atualizado',
        recipe: {
          id: expect.any(String),
          title: 'lasagna',
          category: 'main_dish',
          userId: expect.any(String),
        },
      }),
    )
  })

  it('should delete a recipe', async () => {
    const token =
      await createUserAndLogin(server)

    const recipe = await request(server)
      .post('/recipes')
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send({
        title: 'lasagna',
        category: 'main_dish',
      })

    const recipeId = recipe.body.id

    const response = await request(
      server,
    )
      .delete(`/recipes/${recipeId}`)
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .expect(200)

    expect(response.body.message).toBe(
      'Recipe deleted successfully',
    )
  })
})
