import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { auth } from '../firebase';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import { Route, Redirect } from "react-router-dom";

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

class EditUserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: ""
        }
        this.onSubmitNewName = this.onSubmitNewName.bind(this);
        this.onSubmitNewEmail = this.onSubmitNewEmail.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    onSubmitNewName(event) {
        event.preventDefault();
        if (this.state.name === ""){
            alert("You have not put in your new name. Please put in and try again.")
        }else{
              auth.currentUser.updateProfile( { displayName: this.state.name } )
                .then(() => {
                    this.props.updateDisplayName(this.state.name);
                    this.props.history.push("/");
                    console.log(this.state.name);
                })
                .catch(authError => {
                    alert(authError);
                })
        }
    }

    onSubmitNewEmail(event){
        event.preventDefault();
        if (this.state.email === ""){
            alert("You have not put in your new email. Please put in and try again.")
        }else{
            auth.currentUser.updateEmail(this.state.email)
                .then( ()=> {
                    alert("Your email has been set to " + this.state.email);
                    auth.currentUser.sendEmailVerification();
                    auth.signOut();
                })
                .catch(authError => {
                    alert(authError);
                })

        }
    }

    onClickForgot = () => {
      const email = auth.currentUser.email
      console.log(email)
      auth.sendPasswordResetEmail(email)
      alert("Sent email ")
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
            <div>
                <Grid container>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <h1>Edit User Profile</h1>

                            <form onSubmit={this.onSubmitNewName} autoComplete="off">
                                <TextField
                                    id="name"
                                    label="New name"
                                    className={classes.textField}
                                    onChange={this.handleChange('name')}
                                    margin="normal"
                                    type="text"
                                />
                                <Button variant="raised" color="primary" type="submit"> Change Name</Button>
                            </form>

                            <form onSubmit={this.onSubmitNewEmail} autoComplete="off">
                                <TextField
                                    id="email"
                                    label="New email"
                                    className={classes.textField}
                                    onChange={this.handleChange('email')}
                                    margin="normal"
                                    type="email"
                                />
                                <Button variant="raised" color="primary" type="submit"> Change Email</Button>
                            </form>

                            <Button variant="raised" color="primary" onClick={this.onClickForgot}>Reset Password</Button>

                      </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(EditUserProfile));
