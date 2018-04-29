import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase, { auth } from '../firebase';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email : "",
            password : "",
            forgot: false
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        const { email, password } = this.state;
        if (email && password) {
          auth.signInWithEmailAndPassword(email, password)
          .then(authUser => {
              console.log(authUser);
          })
          .catch(authError => {
              alert(authError);
          })
        } else {

        }
    }

    onClickForgot = () => {
      const {email} = this.state
      auth.sendPasswordResetEmail(email)
      alert("Sent email ")
    }

    onClickFacebook = () => {
      if (!auth.currentUser) {
        var provider = new firebase.auth.FacebookAuthProvider();

        auth.signInWithPopup(provider).then(function(result) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;

        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // [START_EXCLUDE]
        if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
            // If you are using multiple auth providers on your app you should handle linking
            // the user's accounts here.
        } else {
            console.error(error);
        }
      });
      }
      else {
        auth.signOut();
      }
    }

    onClickGoogle = () => {
      if (!auth.currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider();

        auth.signInWithPopup(provider).then(function(result) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;

        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // [START_EXCLUDE]
        if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
            // If you are using multiple auth providers on your app you should handle linking
            // the user's accounts here.
        } else {
            console.error(error);
        }
      });
      }
      else {
        auth.signOut();
      }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        const { email, password } = this.state;
        const classes = this.props.classes;
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <h1>Log in</h1>

                            <TextField
                              id="email"
                              label="Email"
                              className={classes.textField}
                              value={email}
                              onChange={this.handleChange('email')}
                              margin="normal"
                              type="email"
                            />
                            <br />
                            <TextField
                              id="password"
                              label="Password"
                              className={classes.textField}
                              value={password}
                              onChange={this.handleChange('password')}
                              margin="normal"
                              type="password"
                            />
                            <br />
                            <Button variant="raised" color="primary" onClick={this.onSubmit} >Log in</Button>
                            <Button variant="raised" color="primary" onClick={this.onClickForgot}>Forgot Password</Button>
                            <Button variant="raised" color="primary" onClick={this.onClickFacebook}>Log in with Facebook</Button>
                            <Button variant="raised" color="primary" onClick={this.onClickGoogle}>Log in with Google</Button>
                        <p>Dont have an account? <Link to="/signup">Sign up here</Link></p>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Login);
