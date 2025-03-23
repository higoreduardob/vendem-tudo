import { Hono, Context } from 'hono'
import { handle } from 'hono/vercel'
import { initAuthConfig, type AuthConfig } from '@hono/auth-js'

import authConfig from '@/auth.config'

import users from './users'
import foods from './foods'
import stores from './stores'
import customers from './customers'
import management from './management'
import foodOrders from './foods/orders'
import foodOptions from './foods/options'
import authenticate from './authenticate'
import foodCategories from './foods/categories'
import foodAdditionals from './foods/additionals'

const app = new Hono().basePath('/api')

app.use('*', initAuthConfig(getAuthConfig))

const routes = app
  .route('/users', users)
  .route('/foods', foods)
  .route('/stores', stores)
  .route('/customers', customers)
  .route('/management', management)
  .route('/food-orders', foodOrders)
  .route('/food-options', foodOptions)
  .route('/authenticate', authenticate)
  .route('/food-categories', foodCategories)
  .route('/food-additionals', foodAdditionals)

// @ts-ignor
function getAuthConfig(c: Context): AuthConfig {
  return { ...authConfig }
}
export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
