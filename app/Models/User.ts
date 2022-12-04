import { DateTime } from 'luxon'
import { column, BaseModel, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'

import Store from './Store'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public picture?: string

  @column()
  public origin: 'auth0'

  @column()
  public role: 'admin' | 'provider' | 'customer'

  @column()
  public rememberMeToken?: string

  @hasOne(() => Store)
  public store: HasOne<typeof Store>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
