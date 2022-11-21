import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

import User from 'App/Models/User'

const FRONTEND_REDIRECT_URI = `${Env.get('FRONTEND_URL')}/auth/callback`

export default class AuthController {
  public async me({ auth }: HttpContextContract) {
    return auth.user
  }

  public async auth0({ response, session }: HttpContextContract) {
    const state = uuidv4()
    session.put('state', state)

    response.redirect(
      `${Env.get('AUTH0_DOMAIN')}/authorize?` +
        new URLSearchParams({
          client_id: Env.get('AUTH0_CLIENT_ID'),
          redirect_uri: Env.get('APP_URL') + '/authorized/auth0',
          response_type: 'code',
          scope: 'openid profile email',
          state,
        }).toString()
    )
  }

  public async auth0Callback({ auth, request, response }: HttpContextContract) {
    // const { state } = request.all()
    // const sessionState = session.get('state')
    // if (state !== sessionState) return response.badRequest({ message: 'Invalid state' })

    const { code } = request.all()
    let res = await axios.post(`${Env.get('AUTH0_DOMAIN')}/oauth/token`, {
      client_id: Env.get('AUTH0_CLIENT_ID'),
      client_secret: Env.get('AUTH0_CLIENT_SECRET'),
      code,
      grant_type: 'authorization_code',
      redirect_uri: Env.get('APP_URL') + '/authorized',
    })

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { access_token } = res.data

    res = await axios.get(`${Env.get('AUTH0_DOMAIN')}/userinfo`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const { data } = res

    let user = await User.findBy('email', data.email)
    if (!user) {
      user = new User()
      user.role = 'user'
    }

    user.email = data.email
    user.firstName = data.given_name
    user.lastName = data.family_name
    user.picture = data.picture
    user.provider = 'auth0'
    await user.save()

    await auth.login(user)
    response.redirect(FRONTEND_REDIRECT_URI)
  }

  public async auth0Logout({ response }) {
    response.redirect(
      `${Env.get('AUTH0_DOMAIN')}/v2/logout?` +
        new URLSearchParams({
          client_id: Env.get('AUTH0_CLIENT_ID'),
          returnTo: Env.get('APP_URL') + '/logout/auth0/callback',
        }).toString()
    )
  }

  public async auth0LogoutCallback({ auth, response }) {
    await auth.logout()
    response.redirect(Env.get('FRONTEND_URL'))
  }
}
