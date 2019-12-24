import { mongoose } from '../database'
import User from '../../models/User'
import UserService from '../../services/UserService'

async function createDefaultUser() {
  try {
    const userInstance = new User().getInstance()
    const userService = new UserService(userInstance)
    const params = {
      name: '-- DO NOT DELETE --',
      email: 'test@mail.com',
      password: 'azer1234'
    }
    let user = await userInstance.findOne({ email: params.email })
    if (!user) {
      await userService.signup(params)
      console.log(`User ${params.email} Created!`)
    }
    params.email = 'users_put@mail.com'
    user = await userInstance.findOne({ email: params.email })
    if (!user) {
      await userService.signup(params)
      console.log(`User ${params.email} Created!`)
    }
  } catch (error) {
    console.error(error)
  }
}

;(async () => {
  console.log('Executing pretest script...')
  await createDefaultUser()
  mongoose.disconnect()
  console.log('Done.')
})()
