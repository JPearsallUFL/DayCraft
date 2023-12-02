import {Schema, model, models} from 'mongoose'

const noteSchema = new Schema({
    noteID: Schema.Types.ObjectId,
    priorities:{
        type:String
    },
    gratitude:{
        type:String
    },
    water:{
        type:Number
    },
    notes:{
        type:String
    },
    important:{
        type:String
    },
    noteDate: {
        type: String,
    }
},{
    versionKey:false
})

export default models.Note || model('Note', noteSchema)