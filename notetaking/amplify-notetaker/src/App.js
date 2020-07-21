import React, {Component} from 'react';
// import logo from './logo.svg';
// import './App.css';
import {withAuthenticator} from 'aws-amplify-react';
// import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { render } from 'react-dom';

class App extends Component {
  state = {
    notes: [{
      id:1,
      note: 'hello world'
    }]
  }

  render(){
    return (
      // const {notes} = this.state;
  
      <div className='flex flex-column items-center justify-center pa3 bg-washed-red'>
        <h1 className='code f2-1'>Amplify Notetaker</h1>
        <form className='mb3'>
          <input type='text' className='pa2 f4' placeholder='write your note'>
            <button className='pa2 f4' type='submit'>Add Note</button>
          </input>
        </form>
  
        <div>
          {this.state.notes.map(item => (
            <div key={item.id} className='flex items-center'>
              <li className='list pa1 f3'>
                {item.note}
              </li>
              <button className='bg-transparent bn f4'>
                <span>&times;</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
 
}

export default withAuthenticator(App, {includeGreetings:true});
