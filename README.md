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

- Take URL and execute functions

- No space between a decorator and the function

  - ```ts
    @Get('/hello')
    sayHello(): string {
      return 'Hello Everyone';
    }
    ```

  - On browser, `localhost:3000/hello`

  - ```ts
    @Post('/hello')
    sayHello(): string {
      return 'Hello Everyone';
    }
    ```

  - return: `{"statusCode":404,"message":"Cannot GET /hello","error":"Not Found"}`



