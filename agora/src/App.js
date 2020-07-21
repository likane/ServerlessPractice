import React from "react";
import "./App.css";
import { API, graphqlOperation, Amplify, Auth, Hub } from 'aws-amplify';
import { AmplifyTheme, Authenticator, SignOut } from 'aws-amplify-react';
import { AmplifySignOut, Greetings} from '@aws-amplify/ui-react';

import awsconfig from './aws-exports';

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
        break;
      case "signOut":
        console.log('signed Out')
        this.setState({user:null})
        break;
      default:
        return;
    }
  }

  render() {
    const {user} = this.state;
    return !user ? (<Authenticator theme={theme} /> ) : <div> 
      <AmplifySignOut />
      App
      </div>;
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
