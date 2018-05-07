import React, { Component } from 'react';
import { auth } from '../firebase';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Dialog, {DialogTitle} from 'material-ui/Dialog';
// import FlatButton from 'material-ui/FlatButton';
// import RaisedButton from 'material-ui/RaisedButton';

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

class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email : "",
            password : ""
        }
    }

    onSubmit = event => {
        event.preventDefault();
        const { email, password } = this.state;

        auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => {
          this.handleSignup()
          // this.handleOpen()
        })
        .catch(authError => {
            alert(authError);
        })
    }

    handleSignup = () => {
      const user = auth.currentUser;
      user.sendEmailVerification().then(() => {
        alert("Verification email sent")
        auth.signOut()
      }).catch((error) => {
        // whatever
      });
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        const { email, password} = this.state;
        const {classes, ...other} = this.props;
        return (
                <Grid container>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <h1>Sign up</h1>
                            <form onSubmit={this.onSubmit} autoComplete="off">
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
                                <Button variant="raised" color="primary" type="submit">Sign up</Button>

                            </form>
                        </Paper>
                    </Grid>
                </Grid>
        );
    }
}

export default withStyles(styles)(Signup);
