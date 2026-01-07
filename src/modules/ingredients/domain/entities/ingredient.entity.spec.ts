import { IngredientType } from '../../shared/enums/ingredient-type.enum'
import { Ingredient } from './ingredient.entity'

const ingredientInput = {
  name: 'Milk',
  type: IngredientType.DAIRY,
  userId: '1',
}

describe('IngredientEntity', () => {
  it('should create a ingredient', () => {
    const ingredient =
      Ingredient.create(ingredientInput)

    expect(
      ingredient.getId(),
    ).toBeDefined()
    expect(ingredient.getName()).toBe(
      'Milk',
    )
    expect(ingredient.getType()).toBe(
      IngredientType.DAIRY,
    )
  })

  it('should restore ingredient without changing data', () => {
    const date = new Date('2025-01-01')

    const ingredient =
      Ingredient.restore({
        id: '1',
        name: 'Milk',
        type: IngredientType.DAIRY,
        userId: '1',
        createdAt: date,
        updatedAt: date,
      })

    expect(ingredient.getId()).toBe('1')
    expect(ingredient.getName()).toBe(
      'Milk',
    )
    expect(ingredient.getType()).toBe(
      IngredientType.DAIRY,
    )
  })

  it('should update name and updatedAt', async () => {
    const ingredient =
      Ingredient.create(ingredientInput)

    const oldUpdatedAt =
      ingredient.getUpdatedAt()

    await new Promise<void>(
      (resolve) => {
        setTimeout(() => {
          resolve()
        }, 10)
      },
    )

    ingredient.setName('Leite')

    expect(ingredient.getName()).toBe(
      'Leite',
    )
    expect(
      ingredient
        .getUpdatedAt()
        .getTime(),
    ).toBeGreaterThan(
      oldUpdatedAt.getTime(),
    )
  })

  it('should update type and updatedAt', async () => {
    const ingredient =
      Ingredient.create(ingredientInput)

    const oldUpdatedAt =
      ingredient.getUpdatedAt()

    await new Promise<void>(
      (resolve) => {
        setTimeout(() => {
          resolve()
        }, 10)
      },
    )

    ingredient.setType(
      IngredientType.PROTEIN,
    )

    expect(ingredient.getType()).toBe(
      IngredientType.PROTEIN,
    )
    expect(
      ingredient
        .getUpdatedAt()
        .getTime(),
    ).toBeGreaterThan(
      oldUpdatedAt.getTime(),
    )
  })
})
