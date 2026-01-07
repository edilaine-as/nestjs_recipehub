import { Ingredient } from 'src/modules/ingredients/domain/entities/ingredient.entity'
import { RecipeCategory } from '../../shared/enums/recipe-category.enum'
import { Recipe } from './recipe.entity'
import { IngredientType } from 'src/modules/ingredients/shared/enums/ingredient-type.enum'
import { RecipeIngredientUnit } from '../../shared/enums/recipe-ingredient-unit.enum'

const recipeInput = {
  title: 'Pão',
  category: RecipeCategory.SNACK,
  userId: '1',
  ingredients: [],
  steps: [],
}

describe('RecipeEntity', () => {
  it('should create a recipe', () => {
    const recipe = Recipe.create(
      recipeInput,
    )

    expect(recipe.getId()).toBeDefined()
    expect(recipe.getTitle()).toBe(
      'Pão',
    )
  })

  it('should restore recipe without changing data', () => {
    const date = new Date('2025-01-01')

    const recipe = Recipe.restore({
      id: '1',
      title: 'Pão',
      category: RecipeCategory.SNACK,
      userId: '1',
      ingredients: [],
      steps: [],
      createdAt: date,
      updatedAt: date,
    })

    expect(recipe.getId()).toBe('1')
    expect(recipe.getTitle()).toBe(
      'Pão',
    )
  })

  it('should add ingredient to recipe', () => {
    const recipe = Recipe.create(
      recipeInput,
    )

    const ingredient =
      Ingredient.create({
        name: 'Farinha de trigo',
        type: IngredientType.CARBOHYDRATE,
        userId: '1',
      })

    recipe.addIngredient(
      ingredient,
      200,
      RecipeIngredientUnit.KILOGRAM,
    )

    const ingredients =
      recipe.getIngredients()

    expect(ingredients).toHaveLength(1)
    expect(
      ingredients[0].getIngredient(),
    ).toBe(ingredient)
  })

  it('should add step to recipe', () => {
    const recipe = Recipe.create(
      recipeInput,
    )

    recipe.addStep(1, 'Passo número 01')

    const steps = recipe.getSteps()

    expect(steps).toHaveLength(1)
    expect(
      steps[0].getDescription(),
    ).toBe('Passo número 01')
  })

  it('should update title and updatedAt', async () => {
    const recipe = Recipe.create(
      recipeInput,
    )

    const oldUpdatedAt =
      recipe.getUpdatedAt()

    await new Promise<void>(
      (resolve) => {
        setTimeout(() => {
          resolve()
        }, 10)
      },
    )

    recipe.setTitle('Pão de leite')

    expect(recipe.getTitle()).toBe(
      'Pão de leite',
    )
    expect(
      recipe.getUpdatedAt().getTime(),
    ).toBeGreaterThan(
      oldUpdatedAt.getTime(),
    )
  })

  it('should update category and updatedAt', async () => {
    const recipe = Recipe.create(
      recipeInput,
    )

    const oldUpdatedAt =
      recipe.getUpdatedAt()

    await new Promise<void>(
      (resolve) => {
        setTimeout(() => {
          resolve()
        }, 10)
      },
    )

    recipe.setCategory(
      RecipeCategory.MAIN_DISH,
    )

    expect(recipe.getCategory()).toBe(
      RecipeCategory.MAIN_DISH,
    )
    expect(
      recipe.getUpdatedAt().getTime(),
    ).toBeGreaterThan(
      oldUpdatedAt.getTime(),
    )
  })
})
