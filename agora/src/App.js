import React from "react";
import "./App.css";
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {getUser} from './graphql/queries'
import {  API, graphqlOperation, Auth, Hub } from 'aws-amplify';
import { AmplifyTheme, Authenticator } from 'aws-amplify-react';
//import { AmplifySignOut, Greetings} from '@aws-amplify/ui-react';

import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MarketPage from  './pages/MarketPage';
import Navbar from  './components/Navbar';


import awsconfig from './aws-exports';
import { registerUser } from "./graphql/mutations";

export const UserContext = React.createContext()

Amplify.configure(awsconfig);

class App extends React.Component {
  state = {
    user: null
  };

  componentDidMount() {
    this.getUserData();
    Hub.listen('auth', this, 'onHubCapsule')
  }

  getUserData = async () => {
    const user = await Auth.currentAuthenticatedUser()
    user ? this.setState({user}) : this.setState({ user: null })
  }

  onHubCapsule = capsule => {
    switch(capsule.payload.event){
      case "signIn":
        console.log('signed in');
        this.getUserData()
        break;
      case "signUp":
        console.log('signed up')
        this.registerNewUser(capsule.payload.data)
        break;
      case "signOut":
        console.log('signed Out')
        this.setState({user:null})
        break;
      default:
        return;
    }
  }

  registerNewUser = async signInData => {
    const getUserInput = {
      id: signInData.signInUserSession.idToken.payload.sub
    }
    const {data} = await API.graphql(graphqlOperation(getUser, getUserInput))
    if(!data.getUser){
      try {
        const registerUserInput = {
          ...getUserInput,
          username: signInData.username,
          email: signInData.signInUserSession.idToken.payload.email,
          registered: true
        }
        const newUser = await API.graphql(graphqlOperation(registerUser, {input: registerUserInput}))
      } catch (error) {
        console.error("Error registering new user", err)
      }
    }
  }

  handleSignout = async () => {
    try {
      await Auth.signOut();
    } catch (err) {
      console.error('Error Signing out user', err);
    }
  }

  render() {
    const {user} = this.state;
    return !user ? (<Authenticator theme={theme} /> ) : (
      <UserContext.Provider value={{ user }}>
      <Router>
      
      <>
      <Navbar user={user} handleSignout={this.handleSignout} />
        <div className="app-container">
        {/* <AmplifySignOut /> */}
            <Route exact path="/" component={HomePage} />
            <Route exact path="/profile" component={ProfilePage} />
            <Route exact path="/markets/:marketId" component={({match}) => <MarketPage user={user} marketId={match.params.marketId}/>} />
        </div>
      </>
      </Router>
      </UserContext.Provider>
      )
  }
}

const theme = {
  ...AmplifyTheme,
  button: {
    ...AmplifyTheme.button,
    backgroundColor: "var(--light-blue)"
  }
};

//export default withAuthenticator(App, true, [], null, theme);
export default App;
