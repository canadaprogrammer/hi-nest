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

## Create Movie DTO

- Create `/src/movies/dto/create-movie.dto.ts`

  - ```ts
    import { IsString, IsNumber, IsOptional } from 'class-validator';

    export class CreateMovieDto {
      @IsString()
      readonly title: string;

      @IsNumber()
      readonly year: number;

      @IsOptional()
      @IsString({ each: true })
      readonly genres: string[];
    }
    ```

- Validation Decorators

  <!-- prettier-ignore -->
  | Decorator                                       | Description |
  | ------------------------------------------------| ----------- |
  | **Common validation decorators**                | |
  | `@IsDefined(value: any)`                        | Checks if value is defined (!== undefined, !== null). This is the only decorator that ignores skipMissingProperties option. |
  | `@IsOptional()`                                 | Checks if given value is empty (=== null, === undefined) and if so, ignores all the validators on the property. |
  | `@Equals(comparison: any)`                      | Checks if value equals ("===") comparison. |
  | `@NotEquals(comparison: any)`                   | Checks if value not equal ("!==") comparison. |
  | `@IsEmpty()`                                    | Checks if given value is empty (=== '', === null, === undefined). |
  | `@IsNotEmpty()`                                 | Checks if given value is not empty (!== '', !== null, !== undefined). |
  | `@IsIn(values: any[])`                          | Checks if value is in a array of allowed values. |
  | `@IsNotIn(values: any[])`                       | Checks if value is not in a array of disallowed values. |
  | **Type validation decorators**                  | |
  | `@IsBoolean()`                                  | Checks if a value is a boolean. |
  | `@IsDate()`                                     | Checks if the value is a date. |
  | `@IsString()`                                   | Checks if the string is a string. |
  | `@IsNumber(options: IsNumberOptions)`           | Checks if the value is a number. |
  | `@IsInt()`                                      | Checks if the value is an integer number. |
  | `@IsArray()`                                    | Checks if the value is an array |
  | `@IsEnum(entity: object)`                       | Checks if the value is an valid enum |
  | **Number validation decorators**                |
  | `@IsDivisibleBy(num: number)`                   | Checks if the value is a number that's divisible by another. |
  | `@IsPositive()`                                 | Checks if the value is a positive number greater than zero. |
  | `@IsNegative()`                                 | Checks if the value is a negative number smaller than zero. |
  | `@Min(min: number)`                             | Checks if the given number is greater than or equal to given number. |
  | `@Max(max: number)`                             | Checks if the given number is less than or equal to given number. |
  | **Date validation decorators**                  |
  | `@MinDate(date: Date)`                          | Checks if the value is a date that's after the specified date. |
  | `@MaxDate(date: Date)`                          | Checks if the value is a date that's before the specified date. |  
  | **String-type validation decorators**           | |
  | `@IsBooleanString()`                            | Checks if a string is a boolean (e.g. is "true" or "false"). |
  | `@IsDateString()`                               | Alias for `@IsISO8601()`. |
  | `@IsNumberString(options?: IsNumericOptions)`   | Checks if a string is a number. |
  | **String validation decorators**                | |
  | `@Contains(seed: string)`                       | Checks if the string contains the seed. |
  | `@NotContains(seed: string)`                    | Checks if the string not contains the seed. |
  | `@IsAlpha()`                                    | Checks if the string contains only letters (a-zA-Z). |
  | `@IsAlphanumeric()`                             | Checks if the string contains only letters and numbers. |
  | `@IsDecimal(options?: IsDecimalOptions)`        | Checks if the string is a valid decimal value. Default IsDecimalOptions are `force_decimal=False`, `decimal_digits: '1,'`, `locale: 'en-US'` |
  | `@IsAscii()`                                    | Checks if the string contains ASCII chars only. |
  | `@IsBase32()`                                   | Checks if a string is base32 encoded. |
  | `@IsBase64()`                                   | Checks if a string is base64 encoded. |
  | `@IsIBAN()`                                     | Checks if a string is a IBAN (International Bank Account Number). |
  | `@IsBIC()`                                      | Checks if a string is a BIC (Bank Identification Code) or SWIFT code. |
  | `@IsByteLength(min: number, max?: number)`      | Checks if the string's length (in bytes) falls in a range. |
  | `@IsCreditCard()`                               | Checks if the string is a credit card. |
  | `@IsCurrency(options?: IsCurrencyOptions)`      | Checks if the string is a valid currency amount. |
  | `@IsEthereumAddress()`                          | Checks if the string is an Ethereum address using basic regex. Does not validate address checksums. |
  | `@IsBtcAddress()`                               | Checks if the string is a valid BTC address. |
  | `@IsDataURI()`                                  | Checks if the string is a data uri format. |
  | `@IsEmail(options?: IsEmailOptions)`            | Checks if the string is an email.|
  | `@IsFQDN(options?: IsFQDNOptions)`              | Checks if the string is a fully qualified domain name (e.g. domain.com). |
  | `@IsFullWidth()`                                | Checks if the string contains any full-width chars. |
  | `@IsHalfWidth()`                                | Checks if the string contains any half-width chars. |
  | `@IsVariableWidth()`                            | Checks if the string contains a mixture of full and half-width chars. |
  | `@IsHexColor()`                                 | Checks if the string is a hexadecimal color. |
  | `@IsHSLColor()`                                 | Checks if the string is an HSL color based on [CSS Colors Level 4 specification](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). |
  | `@IsRgbColor(options?: IsRgbOptions)`           | Checks if the string is a rgb or rgba color. |
  | `@IsIdentityCard(locale?: string)`              | Checks if the string is a valid identity card code. |
  | `@IsPassportNumber(countryCode?: string)`       | Checks if the string is a valid passport number relative to a specific country code. |
  | `@IsPostalCode(locale?: string)`                | Checks if the string is a postal code. |
  | `@IsHexadecimal()`                              | Checks if the string is a hexadecimal number. |
  | `@IsOctal()`                                    | Checks if the string is a octal number. |
  | `@IsMACAddress(options?: IsMACAddressOptions)`  | Checks if the string is a MAC Address. |
  | `@IsIP(version?: "4"\|"6")`                     | Checks if the string is an IP (version 4 or 6). |
  | `@IsPort()`                                     | Checks if the string is a valid port number. |
  | `@IsISBN(version?: "10"\|"13")`                 | Checks if the string is an ISBN (version 10 or 13). |
  | `@IsEAN()`                                      | Checks if the string is an if the string is an EAN (European Article Number). |
  | `@IsISIN()`                                     | Checks if the string is an ISIN (stock/security identifier). |
  | `@IsISO8601(options?: IsISO8601Options)`        | Checks if the string is a valid ISO 8601 date format. Use the option strict = true for additional checks for a valid date. |
  | `@IsJSON()`                                     | Checks if the string is valid JSON. |
  | `@IsJWT()`                                      | Checks if the string is valid JWT. |
  | `@IsObject()`                                   | Checks if the object is valid Object (null, functions, arrays will return false). |
  | `@IsNotEmptyObject()`                           | Checks if the object is not empty. |
  | `@IsLowercase()`                                | Checks if the string is lowercase. |
  | `@IsLatLong()`                                  | Checks if the string is a valid latitude-longitude coordinate in the format lat, long. |
  | `@IsLatitude()`                                 | Checks if the string or number is a valid latitude coordinate. |
  | `@IsLongitude()`                                | Checks if the string or number is a valid longitude coordinate. |
  | `@IsMobilePhone(locale: string)`                | Checks if the string is a mobile phone number. |
  | `@IsISO31661Alpha2()`                           | Checks if the string is a valid ISO 3166-1 alpha-2 officially assigned country code. |
  | `@IsISO31661Alpha3()`                           | Checks if the string is a valid ISO 3166-1 alpha-3 officially assigned country code. |
  | `@IsLocale()`                                   | Checks if the string is a locale. |
  | `@IsPhoneNumber(region: string)`                | Checks if the string is a valid phone numberusing libphonenumber-js. |
  | `@IsMongoId()`                                  | Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId. |
  | `@IsMultibyte()`                                | Checks if the string contains one or more multibyte chars. |
  | `@IsNumberString(options?: IsNumericOptions)`   | Checks if the string is numeric. |
  | `@IsSurrogatePair()`                            | Checks if the string contains any surrogate pairs chars. |
  | `@IsUrl(options?: IsURLOptions)`                | Checks if the string is an url. |
  | `@IsMagnetURI()`                                | Checks if the string is a [magnet uri format](https://en.wikipedia.org/wiki/Magnet_URI_scheme). |
  | `@IsUUID(version?: "3"\|"4"\|"5"\|"all")`       | Checks if the string is a UUID (version 3, 4, 5 or all ). |
  | `@IsFirebasePushId()`                           | Checks if the string is a [Firebase Push ID](https://firebase.googleblog.com/2015/02/the-2120-ways-to-ensure-unique_68.html) |
  | `@IsUppercase()`                                | Checks if the string is uppercase. |
  | `@Length(min: number, max?: number)`            | Checks if the string's length falls in a range. |
  | `@MinLength(min: number)`                       | Checks if the string's length is not less than given number. |
  | `@MaxLength(max: number)`                       | Checks if the string's length is not more than given number. |
  | `@Matches(pattern: RegExp, modifiers?: string)` | Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i'). |
  | `@IsMilitaryTime()`                             | Checks if the string is a valid representation of military time in the format HH:MM. |
  | `@IsHash(algorithm: string)`                    | Checks if the string is a hash The following types are supported:`md4`, `md5`, `sha1`, `sha256`, `sha384`, `sha512`, `ripemd128`, `ripemd160`, `tiger128`, `tiger160`, `tiger192`, `crc32`, `crc32b`. |
  | `@IsMimeType()`                                 | Checks if the string matches to a valid [MIME type](https://en.wikipedia.org/wiki/Media_type) format |
  | `@IsSemVer()`                                   | Checks if the string is a Semantic Versioning Specification (SemVer). |
  | `@IsISSN(options?: IsISSNOptions)`              | Checks if the string is a ISSN. |
  | `@IsISRC()`                                     | Checks if the string is a [ISRC](https://en.wikipedia.org/wiki/International_Standard_Recording_Code). |
  | `@IsRFC3339()`                                  | Checks if the string is a valid [RFC 3339](https://tools.ietf.org/html/rfc3339) date. |
  | **Array validation decorators**                 | |
  | `@ArrayContains(values: any[])`                 | Checks if array contains all values from the given array of values. |
  | `@ArrayNotContains(values: any[])`              | Checks if array does not contain any of the given values. |
  | `@ArrayNotEmpty()`                              | Checks if given array is not empty. |
  | `@ArrayMinSize(min: number)`                    | Checks if the array's length is greater than or equal to the specified number. |
  | `@ArrayMaxSize(max: number)`                    | Checks if the array's length is less or equal to the specified number. |
  | `@ArrayUnique(identifier?: (o) => any)`         | Checks if all array's values are unique. Comparison for objects is reference-based. Optional function can be speciefied which return value will be used for the comparsion. |
  | **Object validation decorators**                |
  | `@IsInstance(value: any)`                       | Checks if the property is an instance of the passed value. |
  | **Other decorators**                            | |
  | `@Allow()`                                      | Prevent stripping off the property when no other constraint is specified for it. |

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

  <!-- prettier-ignore -->
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

## Transform payload objects

- The `ValidationPipe` can automatically transform payloads to be objects typed according to their DTO classes. To enable auto-transformation, set transform to true.

- On `main.ts`

  - ```ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    ```

- On `movies.service.ts`, change movieId type to number

  - ```ts
    getOne(id: number): Movie {
      const movie = this.movies.find((movie) => movie.id === id);
      if (!movie) {
        throw new NotFoundException(`Movie with ID ${id} not found.`);
      }
      return movie;
    }

    remove(id: number) {
      this.getOne(id);
      this.movies = this.movies.filter((movie) => movie.id !== id);
    }

    create(movieData: CreateMovieDto) {
      this.movies.push({
        id: this.movies.length + 1,
        ...movieData,
      });
    }

    update(id: number, updateData) {
      const movie = this.getOne(id);
      this.remove(id);
      this.movies.push({ ...movie, ...updateData });
    }
    ```

- On `movies.controller.ts`, change movieId type to number

  - ```ts
    @Get(':id')
    getOne(@Param('id') movieId: number) {
      return this.moviesService.getOne(movieId);
    }

    @Delete(':id')
    remove(@Param('id') movieId: number) {
      return this.moviesService.remove(movieId);
    }

    @Patch(':id')
    update(@Param('id') movieId: number, @Body() updateData) {
      return this.moviesService.update(movieId, updateData);
    }
    ```

## Update Movie DTO

- Create `/dto/update-movie.dto.ts`

  - ```ts
    import { IsString, IsNumber } from 'class-validator';

    export class UpdateMovieDto {
      @IsString()
      readonly title?: string;

      @IsNumber()
      readonly year?: number;

      @IsString({ each: true })
      readonly genres?: string[];
    }
    ```

  - It's as same as CreateMovieDto except the variables are not required.

  - It can be changed to using `PartialType()`.

    - `npm i @nestjs/mapped-types`

    - On `/dto/update-movie.dto.ts`

      - ```ts
        import { PartialType } from '@nestjs/mapped-types';
        import { CreateMovieDto } from './create-movie.dto';

        export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
        ```

- On `movies.controller.ts`

  - ```ts
    import { UpdateMovieDto } from './dto/update-movie.dto';

      ...
      @Patch(':id')
      update(@Param('id') movieId: number, @Body() updateData: UpdateMovieDto) {
        return this.moviesService.update(movieId, updateData);
      }
    ```

- On `movies.service.ts`

  - ```ts
    import { UpdateMovieDto } from './dto/update-movie.dto';

      ...
      update(id: number, updateData: UpdateMovieDto) {
        const movie = this.getOne(id);
        this.remove(id);
        this.movies.push({ ...movie, ...updateData });
      }
    ```

# Modules and Dependency Injection

- Create Movies Module

  - `nest g mo movies`

- On `/movies/movies.module.ts`

  - ```ts
    import { Module } from '@nestjs/common';
    import { MoviesController } from './movies.controller';
    import { MoviesService } from './movies.service';

    @Module({
      controllers: [MoviesController],
      providers: [MoviesService],
    })
    export class MoviesModule {}
    ```

- Create App Controller and App Service

  - `nest g co app`

- Move `app.controller.ts` from `/src/app` to `/src` and remove `/app`

- On `app.controller.ts`

  - ```ts
    import { Controller, Get } from '@nestjs/common';

    @Controller('')
    export class AppController {
      @Get()
      home() {
        return 'welcome to my Movie API';
      }
    }
    ```

- On `app.module.ts`

  - ```ts
    import { Module } from '@nestjs/common';
    import { MoviesModule } from './movies/movies.module';
    import { AppController } from './app.controller';

    @Module({
      imports: [MoviesModule],
      controllers: [AppController],
      providers: [],
    })
    export class AppModule {}
    ```

# Testing in Nest

- `Jest` is a delightful JavaScript Testing Framework with a focus on simplicity.

- Keep your test files located near the classes they test. Testing files should have a `.spec` or `.test` suffix.

- `num run test:cov`: It's looking for `.spec.ts` and it will show testing coverage.

- `npm run test:watch`

## Methods of Jest

- `beforeEach(fn, timeout)`

  - Runs a function before each of the tests in this file runs. If the function returns a promise or is a generator, Jest waits for that promise to resolve before running the test.

  - Optionally, you can provide a timeout (in milliseconds) for specifying how long to wait before aborting. Note: The default timeout is 5 seconds.

  - This is often useful if you want to reset some global state that will be used by many tests.

  - If beforeEach is inside a describe block, it runs for each test in the describe block.

  - If you only need to run some setup code once, before any tests run, use `beforeAll` instead.

- `beforeAll(fn, timeout)`

  - Runs a function before any of the tests in this file run. If the function returns a promise or is a generator, Jest waits for that promise to resolve before running tests.

  - Optionally, you can provide a timeout (in milliseconds) for specifying how long to wait before aborting. Note: The default timeout is 5 seconds.

  - This is often useful if you want to set up some global state that will be used by many tests.

- `describe(name, fn)`

  - It creates a block that groups together several related tests.

  - This isn't required - you can write the `test` blocks directly at the top level. But this can be handy if you prefer your tests to be organized into groups.

- `test(name, fn, timeout)`

  - Also under the alias: `it(name, fn, timeout)`

  - All you need in a test file is the test method which runs a test.

  - The first argument is the test name; the second argument is a function that contains the expectations to test. The third argument (optional) is timeout (in milliseconds) for specifying how long to wait before aborting. Note: The default timeout is 5 seconds.

  - Note: If a **promise is returned** from test, Jest will wait for the promise to resolve before letting the test complete. Jest will also wait if you **provide an argument to the test function**, usually called `done`. This could be handy when you want to test callbacks.

    - For example, let's say fetchBeverageList() returns a promise that is supposed to resolve to a list that has lemon in it. You can test this with:

      - ```ts
        test('has lemon in it', () => {
          return fetchBeverageList().then((list) => {
            expect(list).toContain('lemon');
          });
        });
        ```

        - Even though the call to test will return right away, the test doesn't complete until the promise resolves as well.

- `test.todo(name)`

  - Also under the alias: `it.todo(name)`

  - Use `test.todo` when you are planning on writing tests. These tests will be highlighted in the summary output at the end so you know how many tests you still need todo.

  - Note: If you supply a test callback function then the test.todo will throw an error. If you have already implemented the test and it is broken and you do not want it to run, then use `test.skip` instead.

## Unit Test

- Create `/movies/movies.service.spec.ts`

  - ```ts
    import { NotFoundException } from '@nestjs/common';
    import { Test, TestingModule } from '@nestjs/testing';
    import { MoviesService } from './movies.service';

    describe('MoviesService', () => {
      let service: MoviesService;

      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [MoviesService],
        }).compile();

        service = module.get<MoviesService>(MoviesService);
      });

      it('should be defined', () => {
        expect(service).toBeDefined();
      });
    });
    ```

### Test `getAll()`

- On `/movies/movies.service.spec.ts`

  - ```ts
    ...
    describe('MoviesService', () => {
      ...

      describe('getAll', () => {
        it('should return an array', () => {
          const result = service.getAll();

          expect(result).toBeInstanceOf(Array);
        });
      });
    ```

### Test `getOne(id)`

- On `/movies/movies.service.spec.ts`

  - ```ts
    ...
    describe('MoviesService', () => {
      ...

      describe('getOne', () => {
        it('should return a movie', () => {
          service.create({
            title: "Test Movie",
            genres: ['test'],
            year: 2000,
          });

          const movie = service.getOne(1);
          expect(movie).toBeDefined();
          expect(movie.id).toEqual(1);
        });
        it('should throw 404 error', () => {
          try {
            service.getOne(999);
          } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
            expect(e.message).toEqual('Movie with ID 999 not found.');
          }
        });
      });
    ```

### Test `remove(id)`

- ```ts
  describe('remove', () => {
    it('Removes a movie', () => {
      service.create({
        title: 'Test Movie1',
        genres: ['Test'],
        year: 2020,
      });
      service.create({
        title: 'Test Movie2',
        genres: ['Test'],
        year: 2020,
      });
      const beforeRemove = service.getAll().length;
      service.remove(1);
      const aftterRemove = service.getAll().length;
      expect(aftterRemove).toBeLessThan(beforeRemove);
    });

    it('should throw 404 error', () => {
      try {
        service.remove(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
  ```

### Test `create()`

- ```ts
  describe('create', () => {
    it('should create a movie', () => {
      const beforeCreate = service.getAll().length;
      service.create({
        title: 'Test Movie1',
        genres: ['Test'],
        year: 2020,
      });
      const afterCreate = service.getAll().length;
      console.log(beforeCreate, afterCreate);
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });
  ```

### Test `update(id, Movie)`

- ```ts
  describe('update', () => {
    it('should update a movie', () => {
      service.create({
        title: 'Test Movie1',
        genres: ['Test'],
        year: 2020,
      });

      service.update(1, { year: 2021 });
      const movie = service.getOne(1);
      expect(movie.year).toEqual(2021);
    });

    it('should throw 404 error', () => {
      try {
        service.update(999, {});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
  ```

## End to End (E2E) testing

- `npm run test:e2e`

- On `test/app.e2e-spec.ts`

  - ```ts
    import { Test, TestingModule } from '@nestjs/testing';
    import { INestApplication } from '@nestjs/common';
    import * as request from 'supertest';
    import { AppModule } from './../src/app.module';

    describe('AppController (e2e)', () => {
      let app: INestApplication;

      beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
      });

      test('/ (GET)', () => {
        return request(app.getHttpServer())
          .get('/')
          .expect(200)
          .expect('welcome to my Movie API');
      });

      describe('/movies', () => {
        test('GET', () => {
          return request(app.getHttpServer())
            .get('/movies')
            .expect(200)
            .expect([]);
        });

        test('POST', () => {
          return request(app.getHttpServer())
            .post('/movies')
            .send({
              title: 'Movie',
              year: 2000,
              genres: ['Action'],
            })
            .expect(201);
        });

        test('DELETE', () => {
          return request(app.getHttpServer()).delete('/movies').expect(404);
        });
      });

      describe('/movies/:id', () => {
        test.todo('GET');
        test.todo('DELETE');
        test.todo('PATCH');
      });
    });
    ```

### Testing GET movies id

- On `test/app.e2e-spec.ts`

  - ```ts
    ...

    describe('AppController (e2e)', () => {
      let app: INestApplication;

      beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
      });

      ...

      describe('/movies/:id', () => {
        test('GET 200', () => {
          return request(app.getHttpServer())
            .get('/movies/1')
            .expect(200);
        });
        test.todo('DELETE');
        test.todo('PATCH');
      });
    });
    ```

    - It returned `Fail` on GET 200 because `expected 200 "OK", got 404 "Not Found"`.

      - The reason is Movie ID type was `string`, not `number`. We changed the type on `main.ts` as `transform: true`, but it's not applied on the test.

- Add the `ValidationPipe` to the test.

  - ```ts
    ...
    import { ..., ValidationPipe } from '@nestjs/common';

    describe('AppController (e2e)', () => {
      let app: INestApplication;

      beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
          new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
          }),
        );
        await app.init();
      });

      ...

      describe('/movies/:id', () => {
        test('GET 200', () => {
          return request(app.getHttpServer())
          .get('/movies/1')
          .expect(200);
        });
        test('GET 404', () => {
          return request(app.getHttpServer())
          .get('/movies/999')
          .expect(404);
        });
        test.todo('DELETE');
        test.todo('PATCH');
      });
    });
    ```
