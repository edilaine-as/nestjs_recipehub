# RecipeHub

[Leia em Português](#português) | [Read in English](#english)

## English

Backend application for managing recipes built with NestJS and Domain-Driven Design (DDD) principles.
The system allows users to register, authenticate, and manage recipes and ingredients through a clean, layered architecture with full API documentation via Swagger.

This project was created as a study and portfolio project focused on applying DDD, Clean Architecture, and good testing practices in a real-world NestJS application.

### 📝 Features

- User management:
  - User registration
  - Secure login. with JWT
  - Authenticated routes
- Recipe management:
  - Create recipes
  - Update recipes
  - List recipes
  - Get recipe by id
  - Add ingredients to recipes
  - Add steps to recipes
  - Delete recipes
- Ingredient management:
  - Create ingredients
  - Update ingredients
  - List ingredients
  - Get ingredient by id
  - Delete ingredients
- Authentication & Security:
  - JWT-based authentication
  - Protected routes using Guards
- API Documentation:
  - Interactive API documentation with Swagger
- Testing:
  - Unit tests with Jest
  - End-to-end (e2e) tests with isolated database setup

### 🚀 Technologies Used

- NestJS: Node.js framework with support for modular architecture and dependency injection
- TypeScript: Statically typed language for more robust code
- PostgreSQL: Relational database
- TypeORM: ORM for database integration
- JWT (JSON Web Token): Token-based secure authentication
- Swagger – API documentation
- Docker: Simplifies the development environment
- Jest – Unit and e2e testing

### 📦 Installation

1. Clone the repository
   ```
   gh repo clone edilaine-as/nestjs_recipehub
   ```
2. Navigate to the project
   ```
   cd nestjs_recipehub
   ```
3. Install dependencies
   ```
   npm i
   ```
4. Configure the .env file based on .env.example
5. Start the server
   ```
   npm run start:dev
   ```

### 📄 API Documentation (Swagger)

After starting the server, access Swagger at:

```
http://localhost:3000/api
```

### 🧪 Running Tests

- Unit tests:
  ```
  npm run test
  ```
- End-to-end tests:
  ```
  npm run test:e2e
  ```
  The e2e tests run sequentially with an isolated database to ensure consistency.

### 🤝 Contribution

Feel free to contribute! Open an issue or submit a pull request

### 📄 License

This project is licensed under the MIT License. See the LICENSE file for more details

## Português

Aplicação backend para gerenciamento de receitas desenvolvida com NestJS e seguindo os princípios de Domain-Driven Design (DDD).
O sistema permite que usuários se cadastrem, façam login e gerenciem receitas e ingredientes através de uma arquitetura limpa e bem organizada, com documentação completa via Swagger.

Este projeto foi criado como projeto de estudo e portfólio, com foco em aplicar DDD, Clean Architecture e boas práticas de testes em um projeto real com NestJS.

### 📝 Funcionalidades

- Gerenciamento de usuários:
  - Cadastro de usuário
  - Login seguro com JWT
  - Rotas autenticadas
- Gerenciamento de receitas:
  - Criar receitas
  - Atualizar receitas
  - Listar receitas
  - Buscar receita por id
  - Adicionar ingredientes à receita
  - Adicionar passos à receita
  - Deletar receitas
- Gerenciamento de ingredientes:
  - Criar ingredientes
  - Atualizar ingredientes
  - Listar ingredientes
  - Buscar ingrediente por id
  - Deletar ingredientes
- Autenticação e segurança:
  - Autenticação baseada em JWT
  - Rotas protegidas com Guards
- Documentação da API:
  - Documentação interativa com Swagger
- Testes:
  - Testes unitários com Jest
  - Testes end-to-end (e2e) com banco isolado

### 🚀 Tecnologias Utilizadas

- NestJS: Framework Node.js com suporte a arquitetura modular e injeção de dependência
- TypeScript: Tipagem estática para maior robustez
- PostgreSQL: Banco de dados relacional
- TypeORM: ORM para integração com o banco de dados
- JWT (JSON Web Token): Autenticação segura baseada em tokens
- Swagger – documentação da API
- Docker: Para facilitar o ambiente de desenvolvimento
- Jest – Testes unitários e e2e

### 📦 Instalação

1. Clone o repositório:
   ```
   gh repo clone edilaine-as/nestjs_recipehub
   ```
2. Navegue até o projeto
   ```
   cd nestjs_recipehub
   ```
3. Instale as dependências
   ```
   npm i
   ```
4. Configure o arquivo .env, baseado no arquivo .env.example
5. Inicie o servidor
   ```
   npm run start:dev
   ```

### 📄 Documentação da API (Swagger)

Após iniciar o servidor, acesse:

```
http://localhost:3000/api
```

### 🧪 Executando Testes

- Testes unitários:
  ```
  npm run test
  ```
- Testes end-to-end:
  ```
  npm run test:e2e
  ```
  Os testes e2e rodam de forma sequencial com banco isolado para garantir consistência.

### 🤝 Contribuição

Sinta-se à vontade para contribuir! Abra uma issue ou envie um pull request.

### 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
