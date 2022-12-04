/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/login/auth0', 'AuthController.auth0')
Route.get('/authorized/auth0', 'AuthController.auth0Callback')
Route.get('/logout/auth0', 'AuthController.auth0Logout')
Route.get('/logout/auth0/callback', 'AuthController.auth0LogoutCallback')

Route.get('/stores/:slug', 'StoresController.show')

Route.get('/products', 'ProductsController.index')
Route.get('/products/:slug', 'ProductsController.show')

Route.get('/categories', 'CategoriesController.index')
Route.get('/categories/:slug', 'CategoriesController.show')

Route.group(() => {
  Route.get('/me', 'AuthController.me')
  Route.resource('/users', 'UsersController').apiOnly()
  Route.get('/orders', 'OrdersController.index')

  Route.post('/orders', 'OrdersController.store')

  Route.group(() => {
    Route.post('/products', 'ProductsController.store')
    Route.put('/products/:slug', 'ProductsController.update')
    Route.delete('/products/:slug', 'ProductsController.destroy')

    Route.get('/stores/:slug/orders', 'StoresController.orders')
    Route.post('/stores', 'StoresController.store')
    Route.put('/stores/:slug', 'StoresController.update')
  }).middleware('role:admin,provider')
}).middleware('auth')
