import { initAuthConfig, type AuthConfig } from '@hono/auth-js'
import { Hono, Context } from 'hono'
import { handle } from 'hono/vercel'

import authConfig from '@/auth.config'

import foods from './foods'
import stores from './stores'
import foodOptions from './foods/options'
import authenticate from './authenticate'
import foodCategories from './foods/categories'
import foodAdditionals from './foods/additionals'

// import users from './users'

const app = new Hono().basePath('/api')

app.use('*', initAuthConfig(getAuthConfig))

const routes = app
  .route('/foods', foods)
  .route('/stores', stores)
  .route('/food-options', foodOptions)
  .route('/authenticate', authenticate)
  .route('/food-categories', foodCategories)
  .route('/food-additionals', foodAdditionals)

// .route('/users', users)

// @ts-ignor
function getAuthConfig(c: Context): AuthConfig {
  return { ...authConfig }
}
export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
