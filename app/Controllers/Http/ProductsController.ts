import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import { v4 as uuidv4 } from 'uuid'

import Product from 'App/Models/Product'
import ProductValidator from 'App/Validators/ProductValidator'
import { isArray, kebabCase } from 'lodash'

export default class ProductsController {
  public async index({ request, response, auth }: HttpContextContract) {
    const query = Product.query()

    const publishedValue = request.input('published', true)
    if (publishedValue === true || publishedValue === 'true') query.where('published', true)
    else {
      await auth.use('web').authenticate()
      const user = auth.user
      if (!user) return response.unauthorized()
      if (user.role !== 'admin' && user.role !== 'provider') return response.unauthorized()

      if (isArray(publishedValue)) query.whereIn('published', publishedValue)
      else query.where('published', false)

      if (auth.user?.role === 'provider') {
        const store = await auth.user.related('store').query().firstOrFail()
        query.where('storeId', store.id)
      }
    }

    if (request.input('name')) query.where('name', 'like', `%${request.input('name')}%`)
    if (request.input('category'))
      query.whereHas('categories', (q) => q.where('slug', request.input('category')))
    if (request.input('storeId')) query.where('storeId', request.input('storeId'))

    // Search product
    const searchValue = request.input('search')
    if (searchValue) {
      query.where('name', 'ilike', `%${searchValue}%`)
      // query.orWhere('description', 'ilike', `%${searchValue}%`)
      // query.orWhere('characteristics', 'ilike', `%${searchValue}%`)
    }

    return await query.paginate(request.input('page', 1), request.input('limit', 10))
  }

  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(ProductValidator)
    const image = request.file('image')

    const prices = payload.prices
    const categories = payload.categories

    const productData = { ...payload } as any
    productData.slug = this.generateSlug(productData.name)

    delete productData.prices
    delete productData.categories

    if (image) {
      const fileName = `${this.generateSlug(productData.name)}.${image.extname}`
      image.clientName = fileName
      productData.image = fileName
      image.move(Application.tmpPath('uploads/'))
    }

    await Database.transaction(async (trx) => {
      const product = await Product.create(productData, { client: trx })
      await product.related('categories').attach(categories, trx)
      await product.related('productPrices').createMany(prices, { client: trx })
    })
  }

  public async show({ request, params }: HttpContextContract) {
    const { slug } = params
    const query = Product.query().where('slug', slug)
    if (request.input('store')) query.preload('store')

    return await query.firstOrFail()
  }

  public async update({ request, response, params, auth }: HttpContextContract) {
    const { slug } = params

    const searchedProductQuery = Product.query().where('slug', slug)

    const user = auth.user
    if (!user) return response.unauthorized()

    if (user.role === 'provider') {
      const userStore = await user.related('store').query().firstOrFail()
      searchedProductQuery.where('store_id', userStore.id)
    }

    const searchedProduct = await searchedProductQuery.firstOrFail()

    const payload = await request.validate(ProductValidator)
    const image = request.file('image')

    const prices = payload.prices
    const categories = payload.categories

    const productData = { ...payload } as any
    if (productData.name !== searchedProduct.name)
      productData.slug = this.generateSlug(productData.name)

    delete productData.prices
    delete productData.categories

    if (image) {
      const fileName = `${this.generateSlug(productData.name)}.${image.extname}`
      image.clientName = fileName
      productData.image = fileName
      image.move(Application.tmpPath('uploads/'))
    } else delete productData.image

    await Database.transaction(async (trx) => {
      await searchedProduct.merge(productData).save()
      await searchedProduct.related('categories').sync(categories)

      await searchedProduct.related('productPrices').query().delete()
      await searchedProduct.related('productPrices').createMany(prices, { client: trx })
    })
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    const { slug } = params
    const product = await Product.findByOrFail('slug', slug)

    if (auth.user?.role === 'provider') {
      const userStore = await auth.user.related('store').query().firstOrFail()
      if (product.storeId !== userStore.id) return response.unauthorized()
    }

    await product.delete()
  }

  private generateSlug(name: string) {
    return `${kebabCase(name)}-${uuidv4()}`
  }
}
