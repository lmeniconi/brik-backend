import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

import Product from './Product'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public total: number

  @manyToMany(() => Product, {
    pivotTable: 'order_products',
    pivotColumns: ['quantity', 'price'],
  })
  public products: ManyToMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
