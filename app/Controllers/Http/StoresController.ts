import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { kebabCase } from 'lodash'

import Store from 'App/Models/Store'
import Order from 'App/Models/Order'
import StoreValidator from 'App/Validators/StoreValidator'

export default class StoresController {
  public async show({ params }: HttpContextContract) {
    const { slug } = params
    const query = Store.query().where('slug', slug)
    return await query.firstOrFail()
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const payload = await request.validate(StoreValidator)

    const slug = kebabCase(payload.name)
    const data = { ...payload, slug }

    const searchedStore = await Store.findBy('slug', slug)
    if (searchedStore)
      return response.badRequest({ message: 'Store with this name already exists ' })

    const user = auth.user
    if (!user) return response.unauthorized()

    if (user.role === 'provider') {
      const userStore = await user.related('store').query().first()
      if (userStore) return response.badRequest({ message: 'User already has a store' })
    }

    await Store.create(data)
  }

  public async update({ request, response, auth, params }: HttpContextContract) {
    const { slug } = params
    const searchedStore = await Store.findByOrFail('slug', slug)

    const user = auth.user
    if (!user) return response.unauthorized()

    if (user.role === 'provider' && searchedStore.userId !== user.id) return response.unauthorized()

    const payload = await request.validate(StoreValidator)

    const newSlug = kebabCase(payload.name)
    const data = { ...payload, slug: newSlug }

    const slugSearchedStore = await Store.findBy('slug', data.slug)
    if (slugSearchedStore && slugSearchedStore.id !== searchedStore.id)
      return response.badRequest({ message: 'Store with this name already exists ' })

    searchedStore.merge(data)
    await searchedStore.save()
  }

  public async orders({ response, auth }: HttpContextContract) {
    const user = auth.user
    if (!user) return response.unauthorized()

    const userStore = await user.related('store').query().firstOrFail()

    return await Order.query()
      .where('storeId', userStore.id)
      .preload('user')
      .preload('products')
      .preload('store')
      .orderBy('created_at', 'desc')
  }
}
