// import Link from "next/link";
import useLogout from "../../hooks/useLogout";
import { useEffect, useState } from "react";
import format from "date-fns/format";
import { useRouter } from "next/router";
import Calendar from "react-calendar";
import { Container } from "react-bootstrap";
import 'react-calendar/dist/Calendar.css';
// import note from "../../pages/api/note";


export default function Note(props) {
  const logout = useLogout();
  const today = format(new Date(), 'MMM do yyyy');
  let viewDate = format(new Date(), 'MMM do yyyy');
  const router = useRouter()
  const [myNotes, setNotes] = useState([])
  let exists;
  let method;
  let bodyContent;
  
  let [noteID, setNoteID] = useState("")
  
  let [{priorities, gratitude, water, notes, important}, setForm,]=useState({
      priorities: "",
      gratitude: "",
      water: "",
      notes: "",
      important: "",
    });
    
  const [value, setValue] = useState(new Date())

  function selectDate(nextValue){
    setValue(nextValue)
    viewDate = format(new Date(nextValue), 'MMM do yyyy')
    getNoteData()
  }

  function handleChange(e){
    setForm({
      priorities, gratitude, water, notes, important, ...{[e.target.name]:e.target.value},
    });
  }

  async function handleSaveNote(e){
    e.preventDefault();
    console.log(noteID, "here")
    if(noteID){
      method = "PUT"
      bodyContent = {priorities, gratitude, water, notes, important, noteID}
    }
    else{
      method = "POST"
      bodyContent = {priorities, gratitude, water, notes, important, today}
    }
    try{
      console.log(method)  
      const res = await fetch('/api/note', {
        method: method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(bodyContent)
      });
      console.log(res)  
      if (res.status === 200) return router.push("/");
      else{
        const noteError = await res.text();
      }
      const {error: message} = await res.json()
    }
    catch(err){
      console.log(err)
    }
  }

  async function getUserNotes(props){
    try{
        const res = await fetch("/api/user", {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        });
        const list = await res.json()
        setNotes(list.savedNotes)
    }
    catch (err){
        console.log(err)
    }
  }

  async function getNoteData(props){
    console.log(viewDate)
      try{
          if(!(myNotes.length > 0)){
                exists = false
                console.log("false")
                return
            }
            else {
                const note = myNotes.filter((savedNote => savedNote.noteDate === viewDate))
                console.log(note, "here")
                if (note){
                    const pageTitle = document.getElementById("pageTitle")
                    pageTitle.innerHTML = "Note for " + viewDate
                    exists = true
                    setNoteID(note[0].id)
                    console.log(noteID)
                    try{
                        const res = await fetch("/api/note?", {
                            method: "GET",
                            credentials: "include",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                "noteID":note[0].id
                            },
                        });
                        const list = await res.json()
                        setNote(list)
                        
                    }
                    catch(err){
                        console.log(err)
                        return
                    }
                }
                else {
                    exists = false
                    return
                }
            }
        }
        catch(err){
            console.log(err);
        }
    }

    async function setNote(list){
      const form = document.getElementById("noteForm")
      form.priorities.value = list.priorities
      priorities = list.priorities
      form.gratitude.value = list.gratitude
      gratitude = list.gratitude
      form.water.value = list.water
      water = list.water
      form.notes.value = list.notes
      notes = list.notes
      form.important.value = list.important
      important = list.important
      setForm({priorities:list.priorities, gratitude:list.gratitude, water:list.water, notes:list.notes, important:list.important})
    }

    useEffect(() => {getUserNotes();},[]);
    useEffect(() => {getNoteData();},[myNotes]);
    
    return (
        <Container>
            <main className="noteComponent">
                <div>
                    <h1 id="pageTitle">Note for {viewDate}</h1>
                    <div className="break"></div>
                    <Calendar onChange={selectDate} value={value}/>
                    <div className="background_stuff">
                        <form id="noteForm" onSubmit={handleSaveNote}>
                        <div className="one_col">
                            <div className="labelAlign">
                                <label htmlFor="priorities">My Priorities:</label>
                                <textarea name="priorities" id="priorities" onChange={handleChange} value={priorities} />
                            </div>
                            <div className="labelAlign">
                                <label htmlFor="notes">Notes:</label>
                                <textarea name="notes" id="notes" onChange={handleChange} value={notes} />
                            </div>
                            <div className="labelAlign">
                                <label htmlFor="important">Important:</label>
                                <textarea name="important" id="important" onChange={handleChange} value={important} />
                            </div>
                            <div className="labelAlign">
                                <label htmlFor="gratitude">Things I'm Thankful for:</label>
                                <textarea name="gratitude" id="gratitude" onChange={handleChange} value={gratitude} />
                            </div>
                            <div className="water">
                                <label htmlFor="water">Glasses of Water Drunk:</label>
                                <input type="number" name="water" id="water" onChange={handleChange} value={water} />
                            </div>
                        </div>
                        <div className="break"></div>
                        <div className="save"><button>Save</button></div>
                        </form>
                    </div>
                </div>
            </main>
        </Container>
  );
}

