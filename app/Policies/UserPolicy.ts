import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'

import User from 'App/Models/User'

export default class UserPolicy extends BasePolicy {
  public async isProvider(user: User | null) {
    if (!user) return false
    return user.role === 'provider'
  }

  public async isProviderOrAdmin(user: User | null) {
    if (!user) return false
    return ['admin', 'provider'].includes(user.role)
  }
}
