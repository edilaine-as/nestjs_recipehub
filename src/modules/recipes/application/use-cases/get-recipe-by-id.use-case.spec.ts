import { Recipe } from '../../domain/entities/recipe.entity'
import { RecipeCategory } from '../../shared/enums/recipe-category.enum'
import { RecipeRepositoryInMemory } from '../../tests/repositories/recipe.repository.in-memory'
import { GetRecipeByIdUseCase } from './get-recipe-by-id.use-case'

describe('GetRecipeByIdUseCase', () => {
  let useCase: GetRecipeByIdUseCase
  let recipeRepository: RecipeRepositoryInMemory

  const userId = 'user-1'

  beforeEach(() => {
    recipeRepository =
      new RecipeRepositoryInMemory()
    useCase = new GetRecipeByIdUseCase(
      recipeRepository,
    )
  })

  it('should get recipe by id', async () => {
    const recipe = Recipe.create({
      title: 'Pancake',
      category: RecipeCategory.DESSERT,
      userId,
    })

    await recipeRepository.save(recipe)

    const recipeReturnUseCase =
      await useCase.execute(
        recipe.getId(),
        userId,
      )

    expect(
      recipeReturnUseCase?.getTitle(),
    ).toBe('Pancake')
    expect(
      recipeReturnUseCase?.getCategory(),
    ).toBe(RecipeCategory.DESSERT)
    expect(
      recipeReturnUseCase?.getUserId(),
    ).toBe(userId)
  })

  it('should throw an error if the recipe not exists', async () => {
    await expect(
      useCase.execute('1', userId),
    ).rejects.toThrow()
  })
})
