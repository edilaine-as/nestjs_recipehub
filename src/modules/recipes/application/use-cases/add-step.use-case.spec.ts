import { Recipe } from '../../domain/entities/recipe.entity'
import { RecipeCategory } from '../../shared/enums/recipe-category.enum'
import { RecipeRepositoryInMemory } from '../../tests/repositories/recipe.repository.in-memory'
import { AddStepUseCase } from './add-step.use-case'

describe('AddStepUseCase', () => {
  let useCase: AddStepUseCase
  let recipeRepository: RecipeRepositoryInMemory

  const userId = 'user-1'
  const recipeInput = {
    title: 'Pancake',
    category: RecipeCategory.DESSERT,
    userId,
  }
  const stepInput = {
    step: 1,
    description: 'Step number 1',
  }

  beforeEach(() => {
    recipeRepository =
      new RecipeRepositoryInMemory()
    useCase = new AddStepUseCase(
      recipeRepository,
    )
  })

  it('should add step to recipe', async () => {
    const recipe = Recipe.create(
      recipeInput,
    )

    await recipeRepository.save(recipe)

    await useCase.execute(
      recipe.getId(),
      stepInput,
      userId,
    )

    const savedRecipe =
      await recipeRepository.findById(
        recipe.getId(),
        userId,
      )

    expect(savedRecipe).not.toBeNull()
    expect(
      savedRecipe?.getSteps(),
    ).toHaveLength(1)
    expect(
      savedRecipe
        ?.getSteps()[0]
        .getStep(),
    ).toBe(1)
  })

  it('should throw an error if the step already exists in the recipe', async () => {
    const recipe = Recipe.create(
      recipeInput,
    )

    await recipeRepository.save(recipe)

    await useCase.execute(
      recipe.getId(),
      stepInput,
      userId,
    )

    await expect(
      useCase.execute(
        recipe.getId(),
        stepInput,
        userId,
      ),
    ).rejects.toThrow()
  })

  it('should throw an error if the recipe not exists', async () => {
    await expect(
      useCase.execute(
        '1',
        stepInput,
        userId,
      ),
    ).rejects.toThrow()
  })
})
