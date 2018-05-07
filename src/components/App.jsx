import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { auth } from '../firebase';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';

import PrivateRoute from './PrivateRoute';
import Main from './Main';
import Login from './Login';
import Signup from './Signup';
import EditUserProfile from "./EditUserProfile";

const theme = createMuiTheme();
class App extends Component {


  state = {
            loading: true,
            authenticated: false,
            currentUser: null,
            verification: false,
            displayName : ""
           };

  updateDisplayName = (name) => {
        this.setState({
            displayName: name,
        })
    }
    componentWillMount() {
      auth.onAuthStateChanged(user => {

        if (user){
          console.log(user.providerData)
          if (user.providerData[0].providerId !== "password"){
            console.log("chip");
            console.log(user.providerData);
            // TODO: no need to check if email is verified
            const nextState = {
                authenticated: true,
                currentUser: user,
                loading: false,
                verification: true
            };


            this.setState(nextState,
                () => this.props.history.push('/')

            );
          } else {
            const nextState = {
                authenticated: true,
                currentUser: user,
                loading: false,
                verification: true
            };

            if (user.emailVerified) {
              console.log("wat")
                this.setState(nextState,
                  () => {
                    this.props.history.push('/')
                  }
              );
            } else {
              auth.signOut()
              alert("verification needed")
            }
          }
        } else {
            this.setState({
                authenticated: false,
                currentUser: null,
                loading: false,
                verification: false
            });
        }
    })
  }

    render () {
        const { authenticated, loading } = this.state;
        const content = loading ? (
            <div align="center">
                <CircularProgress size={80} thickness={5} />
            </div>
        ) : (
            <div>
                <PrivateRoute
                    exact
                    path="/"
                    component={Main}
                    authenticated={authenticated}
                    />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={Signup} />
                <Route exact path="/edituserprofile" component={() => <EditUserProfile updateDisplayName={this.updateDisplayName} />}  />
            </div>
        );
        return (
            <MuiThemeProvider theme={theme}>
                <div>
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <Typography variant="title" color="inherit">
                                Simple Note
                            </Typography>
                            { authenticated &&
                              <div>
                                <Button
                                variant="raised"
                                color="default"
                                onClick={() => auth.signOut()}>Log out
                              </Button>

                              <Button
                                variant="raised"
                                color="default"
                                 onClick={() => this.props.history.push("/edituserprofile") }> Edit Profile
                              </Button>
                              </div>
                            }
                        </Toolbar>
                    </AppBar>
                    { content }
                </div>
            </MuiThemeProvider>
         );
    }
}

export default withRouter(App);
