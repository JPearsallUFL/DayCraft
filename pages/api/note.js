import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from '../../config/session'
import db from '../../db'

//this handler runs for /api/report with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
    async function handler(req,res){
        switch (req.method){
            case 'POST':
                if (req.session.user) {
                    try{
                        const {priorities, gratitude, water, notes, important, today} = req.body
                        const note = await db.note.create(priorities, gratitude, water, notes, important, today)
                        const noteLink = await db.note.add(req.session.user.id, note.id, today)

                        if (noteLink === null) {
                            req.session.destroy()
                            return res.status(401)
                        }
                        return res.status(200).json(noteLink)
                    }
                    catch (error) {
                        return res.status(400).json({error: error.message})
                    }
                }
                else {
                    return res.status(401).json("User is not logged in")
                }
                
            case 'DELETE':
                if (req.session.user){
                    try{
                        const id = req.headers.id
                        const noteId = {"id":id}
                        const sessionid = req.session.user.id
                        const userId = {_id: sessionid}
                        try{
                            const note = await db.note.remove(userId, noteId)
                            if (note === null) {
                                req.session.destroy()
                                return res.status(401)
                            }
                            return res.status(200).json(note)
                        }
                        catch(error){
                            return res.status(400).json({error: error.message})
                        }
                    }
                    catch(error){
                        return res.status(400).json({error: error.message})
                    }
                }
                else {
                    return res.status(401).json("User is not logged in")
                }
            case 'PUT':
                if (req.session.user) {
                    try{
                        const {priorities, gratitude, water, notes, important, noteID} = req.body
                        const note = db.note.update(priorities, gratitude, water, notes, important, noteID)
                        if (note === null) {
                            req.session.destroy()
                            return res.status(401)
                        }
                        return res.status(200).json("Note Updated")
                    }
                    catch (error) {
                        return res.status(400).json({error: error.message})
                    }
                }
                else {
                    return res.status(401).json("User is not logged in")
                }
            case "GET":
                if (req.session.user){
                    const noteID = req.headers.noteid
                    try{
                        const note = await db.note.getByNoteId(noteID)
                        return res.status(200).json(note)
                    }
                    catch(error){
                        return res.status(400).json({error: error.message})
                    }
                }
                else {
                    return res.status(401).json("User is not logged in")
                }
            default:
                return res.status(404).end()
        }
    },
    sessionOptions
)