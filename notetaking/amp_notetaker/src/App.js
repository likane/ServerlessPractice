import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import { API, graphqlOperation } from 'aws-amplify';
//import { withAuthenticator } from 'aws-amplify-react';
import { withAuthenticator, AmplifySignOut, Greetings} from '@aws-amplify/ui-react';

import {createNote, deleteNote, updateNote} from './graphql/mutations';
import {listNotes} from './graphql/queries';
import { onCreateNote , onDeleteNote, onUpdateNote} from './graphql/subscriptions';


class App extends Component {
  state = {
    id:"",
    note:"",
    notes: []
  }

 componentDidMount() {
  this.getNotes();
  this.createNoteListener = API.graphql(graphqlOperation(onCreateNote)).subscribe({
    next: noteData => {
      const newNote = noteData.value.data.onCreateNote
      const prevNotes = this.state.notes.filter(note => note.id !== newNote.id)
      const updatedNotes = [...prevNotes, newNote];
      this.setState({ notes: updatedNotes })
    }
  });
    this.deleteNoteListener = API.graphql(graphqlOperation(onDeleteNote)).subscribe(
      {
        next: noteData => {
          const deletedNote = noteData.value.data.onDeleteNote
          const updatedNotes = this.state.notes.filter(note => note.id !==
            deletedNote.id)
            this.setState({notes: updatedNotes})
        }
      }
    );

    this.updateNoteListener = API.graphql(graphqlOperation(onUpdateNote)).subscribe(
      {
        next: noteData => {
          const {notes} = this.state;
          const updatedNote = noteData.value.data.onUpdateNote;
          const index = notes.findIndex(note => note.id === updateNote.id);
          const updatedNotes = [
            ...notes.slice(0, index),
            updateNote,
            ...notes.slice(index+1)
          ];
        
          this.setState({ notes: updatedNotes, note:"", id:""});
        }

      }
    )
  }

  componentWillUnmount(){
    this.createNoteListener.unsubscribe();
    this.deleteNoteListener.unsubscribe();
    this.updateNoteListener.unsubscribe();
  }

  getNotes = async () => {
    const result = await API.graphql(graphqlOperation(listNotes))
    this.setState({notes: result.data.listNotes.items})
  }

  handleChangeNote = event => this.setState({note:event.target.value});

  hasExistingNote = () => {
    const {notes, id} = this.state
    if(id){
      const isNote = notes.findIndex(note => note.id === id) > -1
      return isNote;
    }

    return false;
  }

  handleAddNote = async event => {
    const {note, notes} = this.state;
    event.preventDefault();
    // check if we have an existing note, if so update it
    if (this.hasExistingNote()){
      this.handleUpdateNote();
    } else {
      const input = {
        note
      }
      await API.graphql(graphqlOperation(createNote, { input }))
      // const newNote = result.data.createNote
      // const updatedNotes = [newNote, ...notes]
      this.setState({ note:" "});
    }
  }

handleUpdateNote = async () =>{
  const {notes, id, note} = this.state;
  const input = {id, note}
  await API.graphql(graphqlOperation(updateNote, {input}))
 
}

  handleDeleteNote = async noteId => {
    const { notes } = this.state
    const input = { id: noteId}
    await API.graphql(graphqlOperation(deleteNote, {input}))
    // const deletedNoteId = result.data.deleteNote.id;
    // const updatedNotes = notes.filter(note => note.id !== deletedNoteId)
    // this.setState({notes: updatedNotes});
  }

  handleSetNote = ({note, id})=> this.setState({note,id});

  render(){
    const {id, note, notes} = this.state;
    return (
      
      <div>
        <AmplifySignOut />
        <div>
          <h1>Note Taker</h1>
          <form onSubmit={this.handleAddNote}>
            <input type='text' placeholder='write your note' onChange={this.handleChangeNote} value={note}>  
            </input>
            <button type='submit'>{id ? "Update Note" : "Add Note"}</button>
          </form>
        </div>

     {/* // list */}
     <div>
        {notes.map(item=> (
          <div key={item.id}>
            <li onClick={()=>this.handleSetNote(item)}>{item.note}</li>
            <button onClick={() => this.handleDeleteNote(item.id)}><span>&times;</span></button>
          </div>
        ))}
     </div>
       
      
      </div>
    );
  } 
}

export default withAuthenticator(App, {includeGreetings: true});
