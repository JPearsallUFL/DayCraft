import User from '../models/user'
import Note from '../models/note'
import { normalizeId, dbConnect } from './util'

export async function getAll(userId) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  if (!user) return null
  return user
}

export async function getByNoteId(noteId){
  await dbConnect()
  const note = Note.findById(noteId).lean()
  if (note) return note
  return null
}

export async function create(priorities, gratitude, water, notes, important, noteDate){
  await dbConnect()
  const note = await Note.create({priorities, gratitude, water, notes, important, noteDate})
  if (!note){
      throw new Error('Error inserting Note')
  }
  return normalizeId(note)
}

export async function add(userId, noteId, today) {
  
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { savedNotes: {id: noteId, noteDate: today} } },
    { new: true }
    )
  if (!user){
    return null
  }
    
  return {}
}

export async function remove(userId, noteId) {
  await dbConnect()
  const note = noteId.id
  try{
    let user = await User.findById(userId)
      if (!user) throw new Error("User does not exist")
    user.savedNotes = user.savedNotes.filter(savedNote => savedNote.id !== note)
    user.save()
    return user
  }
  catch(error) {
    return null
  }
}

export async function update(priorities, gratitude, water, notes, important, noteID){
  await dbConnect()
  const body = {
    "priorities":priorities,
    "gratitude":gratitude,
    "water":water,
    "notes":notes,
    "important":important,
  }
  const note = await Note.findOneAndUpdate({"_id":noteID},{$set:body},{returnOriginal: false})

  if (!note)
    throw new Error('Error updating Report')

  return normalizeId(note)
}