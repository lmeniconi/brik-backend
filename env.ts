/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  APP_URL: Env.schema.string(),
  FRONTEND_URL: Env.schema.string(),

  APP_NAME: Env.schema.string(),
  APP_KEY: Env.schema.string(),
  DRIVE_DISK: Env.schema.enum(['local'] as const),
  SESSION_DRIVER: Env.schema.string(),

  DB_CONNECTION: Env.schema.string(),
  PG_HOST: Env.schema.string({ format: 'host' }),
  PG_PORT: Env.schema.number(),
  PG_USER: Env.schema.string(),
  PG_PASSWORD: Env.schema.string.optional(),
  PG_DB_NAME: Env.schema.string(),

  AUTH0_DOMAIN: Env.schema.string(),
  AUTH0_CLIENT_ID: Env.schema.string(),
  AUTH0_CLIENT_SECRET: Env.schema.string(),
})
