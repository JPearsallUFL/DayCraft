import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from '../../config/session'
import db from '../../db'

//this handler runs for /api/report with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
    async function handler(req,res){
        switch (req.method){
            case 'POST':
                return res.status(401).json("Not a valid API call")
            case 'DELETE':
                return res.status(401).json("Not a valid API call")
            case 'PUT':
                return res.status(401).json("Not a valid API call")
            case "GET":
                if (req.session.user){
                    try{
                        const note = await db.note.getAll(req.session.user.id)
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