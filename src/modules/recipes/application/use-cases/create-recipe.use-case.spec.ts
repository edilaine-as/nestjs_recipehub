import { RecipeCategory } from '../../shared/enums/recipe-category.enum'
import { RecipeRepositoryInMemory } from '../../tests/repositories/recipe.repository.in-memory'
import { CreateRecipeUseCase } from './create-recipe.use-case'

describe('CreateRecipeUseCase', () => {
  let useCase: CreateRecipeUseCase
  let recipeRepository: RecipeRepositoryInMemory

  const userId = 'user-1'

  beforeEach(() => {
    recipeRepository =
      new RecipeRepositoryInMemory()
    useCase = new CreateRecipeUseCase(
      recipeRepository,
    )
  })

  it('should create a new recipe', async () => {
    const recipe =
      await useCase.execute({
        title: 'Pancake',
        category:
          RecipeCategory.DESSERT,
        userId,
      })

    const storedRecipe =
      await recipeRepository.findById(
        recipe.getId(),
        userId,
      )

    expect(storedRecipe).not.toBeNull()
    expect(
      storedRecipe?.getTitle(),
    ).toBe('Pancake')
  })
})
