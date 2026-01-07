import { Recipe } from '../../domain/entities/recipe.entity'
import { RecipeCategory } from '../../shared/enums/recipe-category.enum'
import { RecipeRepositoryInMemory } from '../../tests/repositories/recipe.repository.in-memory'
import { UpdateStepUseCase } from './update-step.use-case'

describe('UpdateStepUseCase', () => {
  let useCase: UpdateStepUseCase
  let recipeRepository: RecipeRepositoryInMemory

  const userId = 'user-1'

  beforeEach(() => {
    recipeRepository =
      new RecipeRepositoryInMemory()
    useCase = new UpdateStepUseCase(
      recipeRepository,
    )
  })

  it('should update step', async () => {
    const recipe = Recipe.create({
      title: 'Pancake',
      category: RecipeCategory.DESSERT,
      userId,
    })

    recipe.addStep(1, 'Step number...')

    await recipeRepository.save(recipe)

    await useCase.execute(
      recipe.getSteps()[0].getId(),
      {
        description: 'Step number 1',
      },
      userId,
    )

    expect(
      recipe
        .getSteps()[0]
        .getDescription(),
    ).toBe('Step number 1')
  })

  it('should throw an error if the recipe step not exists', async () => {
    await expect(
      useCase.execute(
        '1',
        {
          description: 'Update step',
        },
        userId,
      ),
    ).rejects.toThrow()
  })
})
