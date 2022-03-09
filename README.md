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

  - It updates `src/app.modules.ts`

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

# Movies Service

- `nest generate service movies`

  - It creates `src/movies/movies.service.spec.ts` and `src/movies/movies.service.ts`

  - It updates `src/app.modules.ts`

    - ```ts
      import { MoviesService } from './movies/movies.service';

      @Module({
        imports: [],
        controllers: [],
        providers: [MoviesService],
      })
      ```

- Delete `src/movies/movies.service.spec.ts`

- Create `/movies/entities/movie.entity.ts`

  - ```ts
    export class Movie {
      id: number;
      title: string;
      year: number;
      genres: string[];
    }
    ```

- On `movies.service.ts`

  - ```ts
    import { Injectable, NotFoundException } from '@nestjs/common';
    import { Movie } from './entities/movie.entity';

    @Injectable()
    export class MoviesService {
      private movies: Movie[] = [];

      getAll(): Movie[] {
        return this.movies;
      }

      getOne(id: string): Movie {
        // return this.movies.find((movie) => movie.id === parseInt(id));
        const movie = this.movies.find((movie) => movie.id === +id);
        if (!movie) {
          throw new NotFoundException(`Movie with ID ${id} not found.`);
        }
        return movie;
      }

      remove(id: string) {
        this.getOne(id);
        this.movies = this.movies.filter((movie) => movie.id !== +id);
      }

      create(movieData) {
        this.movies.push({
          id: this.movies.length + 1,
          ...movieData,
        });
      }

      update(id: string, updateData) {
        const movie = this.getOne(id);
        this.remove(id);
        this.movies.push({ ...movie, ...updateData });
      }
    }
    ```

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
    import { MoviesService } from './movies.service';
    @Controller('movies')
    export class MoviesController {
      constructor(private readonly moviesService: MoviesService) {}
      @Get()
      getAll() {
        return this.moviesService.getAll();
      }

      @Get('search')
      search(@Query('year') searchingYear: string) {
        return `We are searching for a movie made after: ${searchingYear}`;
      }

      @Get(':id')
      getOne(@Param('id') movieId: string) {
        return this.moviesService.getOne(movieId);
      }

      @Post()
      create(@Body() movieData) {
        return this.moviesService.create(movieData);
      }

      @Delete(':id')
      remove(@Param('id') movieId: string) {
        return this.moviesService.remove(movieId);
      }

      @Patch(':id')
      update(@Param('id') movieId: string, @Body() updateData) {
        return this.moviesService.update(movieId, updateData);
      }
    }
    ```

# Data Transfer Object (DTO) and Validation

- DTO: An object that carries data between processes.

- `npm i class-validator class-transformer`

- Create `/src/movies/dto/create-movie.dto.ts`

  - ```ts
    import { IsString, IsNumber } from 'class-validator';

    export class CreateMovieDto {
      @IsString()
      readonly title: string;

      @IsNumber()
      readonly year: number;

      @IsString({ each: true })
      readonly genres: string[];
    }
    ```

- On `movies.controller.ts`

  - ```ts
    import { CreateMovieDto } from './dto/create-movie.dto';

      ...

      @Post()
      create(@Body() movieData: CreateMovieDto) {
        return this.moviesService.create(movieData);
      }
    ```

- On `movies.service.ts`

  - ```ts
    import { CreateMovieDto } from './dto/create-movie.dto';

      ...

      create(movieData: CreateMovieDto) {
        this.movies.push({
          id: this.movies.length + 1,
          ...movieData,
        });
      }
    ```

## `ValidationPipe` makes use of the powerful `class-validator` package and its declarative validation decorators.

- On `main.ts`

  - ```ts
    import { ValidationPipe } from '@nestjs/common';
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';

    async function bootstrap() {
      const app = await NestFactory.create(AppModule);
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
      );
      await app.listen(3000);
    }
    bootstrap();
    ```

  - Body input of create: `{"hacked": "this data was hacked"}`

  - output

    - ```json
      {
        "statusCode": 400,
        "message": [
          "property hacked should not exist", // It's from `forbidNonWhitelisted: true`
          "title must be a string",
          "year must be a number conforming to the specified constraints",
          "each value in genres must be a string"
        ],
        "error": "Bad Request"
      }
      ```

- `class-validator` options

  | Option                   | Type     | Description                                                                                                                         |
  | ------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
  | enableDebugMessages      | boolean  | If set to true, validator will print extra warning messages to the console when something is not right.                             |
  | skipUndefinedProperties  | boolean  | If set to true, validator will skip validation of all properties that are null in the validating object.                            |
  | skipNullProperties       | boolean  | If set to true, validator will skip validation of all properties that are null or undefined in the validating object.               |
  | skipMissingProperties    | boolean  | If set to true, validator will skip validation of all properties that are missing in the validating object.                         |
  | **whitelist**            | boolean  | If set to true, validator will strip validated (returned) object of any properties that do not use any validation decorators.       |
  | **forbidNonWhitelisted** | boolean  | If set to true, instead of stripping non-whitelisted properties validator will throw an exception.                                  |
  | forbidUnknownValues      | boolean  | If set to true, attempts to validate unknown objects fail immediately.                                                              |
  | disableErrorMessages     | boolean  | If set to true, validation errors will not be returned to the client.                                                               |
  | errorHttpStatusCode      | number   | This setting allows you to specify which exception type will be used in case of an error. By default it throws BadRequestException. |
  | exceptionFactory         | Function | Takes an array of the validation errors and returns an exception object to be thrown.                                               |
  | groups                   | string[] | Groups to be used during validation of the object.                                                                                  |
  | always                   | boolean  | Set default for always option of decorators. Default can be overridden in decorator options                                         |
  | strictGroups             | boolean  | If groups is not given or is empty, ignore decorators with at least one group.                                                      |
  | dismissDefaultMessages   | boolean  | If set to true, the validation will not use default messages. Error message always will be undefined if its not explicitly set.     |
  | validationError.target   | boolean  | Indicates if target should be exposed in ValidationError.                                                                           |
  | validationError.value    | boolean  | Indicates if validated value should be exposed in ValidationError.                                                                  |
  | stopAtFirstError         | boolean  | When set to true, validation of the given property will stop after encountering the first error. Defaults to false.                 |
