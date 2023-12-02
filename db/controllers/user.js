import User from '../models/user'
import { normalizeId, dbConnect } from './util'

export async function create(username, password) {
  if (!(username && password)){
    throw new Error('All fields must be included.')
  }

  await dbConnect()
  const existing = await User.findOne({username}).lean()

  if (existing)
      throw new Error('Username already exists, please login, or choose a different username')
  try {
    const user = await User.create({username, password})
    if (!user)
      throw new Error('Error inserting User')
    return normalizeId(user)
  }
  catch (err) {
    console.log(err)
  }
  return Error
}