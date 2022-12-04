import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'

import Category from './Category'
import Store from './Store'
import ProductPrice from './ProductPrice'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public slug: string

  @column()
  public published: boolean

  @column()
  public image: string

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public characteristics?: string

  @column()
  public stock: number

  @column()
  public width: number

  @column()
  public depth: number

  @column()
  public height: number

  @column()
  public weight?: number

  @hasMany(() => ProductPrice)
  public productPrices: HasMany<typeof ProductPrice>

  @manyToMany(() => Category, {
    pivotTable: 'product_categories',
  })
  public categories: ManyToMany<typeof Category>

  @column()
  public storeId: number

  @belongsTo(() => Store)
  public store: BelongsTo<typeof Store>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeFetch()
  @beforeFind()
  public static async preloadDefault(query) {
    query.preload('categories')
    query.preload('productPrices', (query) => {
      query.orderBy('price', 'desc')
    })
  }
}
