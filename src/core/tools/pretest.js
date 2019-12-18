import { mongoose } from '../database'
import User from '../../models/User'
import UserService from '../../services/UserService'

async function createDefaultUser() {
  try {
    const userInstance = new User().getInstance()
    const email = 'test@mail.com'
    const user = await userInstance.findOne({ email })
    if (!user) {
      const userService = new UserService(userInstance)
      await userService.signup({ name: '-- DO NOT DELETE --', email, password: 'azer1234' })
      console.log('Default User Created!')
    }
  } catch (error) {
    console.error(error)
  }
}

;(async () => {
  console.log('Executing pretest script...')
  await createDefaultUser()
  console.log('Done.')
  mongoose.disconnect()
})()
