import { initAuthConfig, type AuthConfig } from '@hono/auth-js'
import { Hono, Context } from 'hono'
import { handle } from 'hono/vercel'

import authConfig from '@/auth.config'

// import users from './users'
import stores from './stores'
// import foods from './products/foods'
import authenticate from './authenticate'
// import categories from './products/categories'
// import foodoptions from './products/foods/options'
// import foodadditionals from './products/foods/additionals'

const app = new Hono().basePath('/api')

app.use('*', initAuthConfig(getAuthConfig))

const routes = app
.route('/stores', stores)
.route('/authenticate', authenticate)
// .route('/users', users)
// .route('/foods', foods)
  // .route('/categories', categories)
  // .route('/foodoptions', foodoptions)
  // .route('/foodadditionals', foodadditionals)

// @ts-ignor
function getAuthConfig(c: Context): AuthConfig {
  return { ...authConfig }
}
export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
