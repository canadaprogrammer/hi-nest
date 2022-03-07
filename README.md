# Install Nest.js

- ```bash
  npm i -g @nestjs/cli

  nest new
  project name: hi-nest
  package manager: npm
  ```

- Remove `/src/app.controller.spec.ts`

- Test

  - `npm run start:dev`

  - On browser `localhost:3000`

# Architecture of NestJS

1. `main.ts` use `AppModule` from `app.module.ts`

2. `app.module.ts` use `AppController` and `AppService`

3. `app.controller.ts` use `AppService`

4. `app.service.ts` has the return value

## Controller

- Controller takes URL and executes functions

- No space between a decorator and the function

  - ```ts
    @Get('/hello')
    sayHello(): string {
      return 'Hello Everyone';
    }
    ```

  - On browser, `localhost:3000/hello`

    - return: `Hello Everyone`

  - ```ts
    @Post('/hello')
    sayHello(): string {
      return 'Hello Everyone';
    }
    ```

    - return: `{"statusCode":404,"message":"Cannot GET /hello","error":"Not Found"}`

## Services

- Service execute business logic.

  - On Controller

    - ```ts
      @Get('/hello')
      sayHello: string {
        return this.appService.getHi();
      }
      ```

  - On Service

    - ```ts
      getHi(): string {
        return 'Hello Everyone';
      }
      ```

# Initialize

- Remove `app.controller.ts` and `app.service.ts`

- On `app.module.ts`

  - ```ts
    import { Module } from '@nestjs/common';

    @Module({
      imports: [],
      controllers: [],
      providers: [],
    })
    export class AppModule {}
    ```

# Nest cli

- `nest <command> [options]`

  - Options:

    - `-v, --version`: Output the current version.

    - `-h, --help`: Output usage information.

  - Commands:

    - `new|n [options] [name]`: Generate Nest application.

    - `build [options] [app]`: Build Nest application.

    - `start [options] [app]`: Run Nest application.

    - `info|i`: Display Nest project details.

    - `update|u [options]`: Update Nest dependencies.

    - `add [options] <library>`: Adds support for an external library to your project.

    - `generate|g [options] <schematic> [name] [path]`: Generate a Nest element.

      - Schematics available on @nestjs/schematics collection:

        |     name      |    alias    |                 description                  |
        | :-----------: | :---------: | :------------------------------------------: |
        |  application  | application |     Generate a new application workspace     |
        |     class     |     cl      |             Generate a new class             |
        | configuration |   config    |      Generate a CLI configuration file       |
        |  controller   |     co      |      Generate a controller declaration       |
        |   decorator   |      d      |         Generate a custom decorator          |
        |    filter     |      f      |        Generate a filter declaration         |
        |    gateway    |     ga      |        Generate a gateway declaration        |
        |     guard     |     gu      |         Generate a guard declaration         |
        |  interceptor  |     in      |     Generate an interceptor declaration      |
        |   interface   |  interface  |            Generate an interface             |
        |  middleware   |     mi      |      Generate a middleware declaration       |
        |    module     |     mo      |        Generate a module declaration         |
        |     pipe      |     pi      |         Generate a pipe declaration          |
        |   provider    |     pr      |       Generate a provider declaration        |
        |   resolver    |      r      |   Generate a GraphQL resolver declaration    |
        |    service    |      s      |        Generate a service declaration        |
        |    library    |     lib     |   Generate a new library within a monorepo   |
        |    sub-app    |     app     | Generate a new application within a monorepo |
        |   resource    |     res     |         Generate a new CRUD resource         |

# Generate Movies Controller

- `nest generate controller movies`

- It creates `src/movies/movies.controller.spec.ts` and `src/movies/movies.controller.ts`

- The controller is added on `src/app.modules.ts`

  - ```ts
    import { MoviesController } from './movies/movies.controller';

    @Module({
      imports: [],
      controllers: [MoviesController],
      providers: [],
    })
    ```

- Delete `src/movies/movies.controller.spec.ts`

- On `movies.controller.ts`

  - ```ts
    import {
      Body,
      Controller,
      Delete,
      Get,
      Param,
      Patch,
      Post,
      Query,
    } from '@nestjs/common';

    @Controller('movies')
    export class MoviesController {
      @Get()
      getAll() {
        return 'This will return all movies';
      }

      @Get('search')
      search(@Query('year') searchingYear: string) {
        return `We are searching for a movie made after: ${searchingYear}`;
      }

      // ':id' needs to be at the last of the method.
      // If 'search' is after ':id', 'search' will be recognized as ':id'
      @Get(':id')
      getOne(@Param('id') movieId: string) {
        return `This will return the movie with the id: ${movieId}`;
      }

      @Post()
      create(@Body() movieData) {
        return movieData;
      }

      @Delete(':id')
      remove(@Param('id') movieId: string) {
        return `This will delete the movie with the id: ${movieId}`;
      }

      @Patch(':id')
      update(@Param('id') movieId: string, @Body() updateData) {
        return {
          updatedMovie: movieId,
          ...updateData,
        };
      }
    }
    ```

- Test it on Insomnia

  - `localhost:3000/movies` returns 'This will return all movies'

  - `localhost:3000/movies/123` returns 'This will return the movie with the id: 123'
