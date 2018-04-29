# Module 1: Simple Note App

1. Design our simple note app on the board
2. `npm install -g create-react-app`
3. `create-react-app simple-note`
4. `yarn start` to test
5. Set up a git repo for the project
6. Remove everything in `src` except `index.js` and `registerServiceWorker.js`
7. Create `src/components`
8. Touch `App.jsx` and put in the bare minimum:
    ```
    import React, { Component } from 'react';

    class App extends Component {
        render () {
            return (
                <div>
                    Hello from App
                </div>
            );
        }
    }

    export default App;
    ```

9. Do the same for `Login.jsx`, `Signup.jsx` and `Main.jsx`

10. Clean up `index.js`

11. Set up a router: `yarn add react-router-dom`

12. Wrap `<BrowserRouter>` around `<App />` in `index.js`

13. Add `<Route>` to `App.jsx`:
    ```
    return (
    <div>
        <Route exact path="/" component={Main} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
    </div>
    );
    ```

14. Work on the login form:
    ```
    class Login extends Component {

      constructor(props) {
          super(props);
          this.state = {
              email : "",
              password : ""
          }
          this.onSubmit = this.onSubmit.bind(this);
      }

      onSubmit(event) {
          alert('on submit!');
      }

      render() {
          const { email, password } = this.state;
          return (
              <div>
                  <h1>Log in</h1>
                  <form onSubmit={this.onSubmit}>
                      <input
                          value={email}
                          onChange={()=>null}
                          type="text"
                          placeholder="Email Address"
                      />
                      <input
                          value={password}
                          onChange={()=>null}
                          type="password"
                          placeholder="Enter Password"
                      />
                      <button type="submit">
                        Log in
                      </button>
                  </form>
              </div>
              );
          }
      }
    ```

15. Work on the `onChange` handler

16. Create and set up firebase in the google console; do `yarn add firebase`

17. Make `firebase.js`
    ```
    import firebase from 'firebase';

    const config = { ... };

    firebase.initializeApp(config);

    export default firebase;
    export const db = firebase.database();
    export const auth = firebase.auth();
    ```

1. In `Login.jsx`
    ```
    onSubmit(event) {
        event.preventDefault();
        const { email, password } = this.state;
        auth.signInWithEmailAndPassword(email, password)
        .then(authUser => {
            console.log(authUser);
        })
        .catch(authError => {
            alert(authError);
        })
    }
    ```

1. Do the same for signup, but use this onSubmit instead:
    ```
    onSubmit(event) { event.preventDefault();
        const { email, password} = this.state;
        auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => {
            console.log(authUser);
        })
        .catch(authError => { console.log(authError);
        })
    }
    ```

1. Now keeping user state in App:
    ```
    import { auth } from '../firebase';
    import { withRouter } from 'react-router-dom';

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            authenticated: false,
            user: null };
        }

    componentWillMount() { auth.onAuthStateChanged(user => {
        if (user) {
            this.setState({
                authenticated: true,
                currentUser: user,
                loading: false },
                () => {
                    this.props.history.push('/')
                    });
        } else {
            this.setState({
                authenticated: false,
                currentUser: null,
                loading: false
                });
            }
        });
    }
    ```

1. Add `PrivateRoute.jsx` component.
    ```
    import React from "react";
    import { Route, Redirect } from "react-router-dom";

    export default function PrivateRoute({
      component: Component,
      authenticated,
      ...rest
    }) {
      return (
        <Route
          {...rest}
          render={props =>
            authenticated === true ? (
              <Component {...props} {...rest} />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
      );
    }
    ```

1. Protect main page with PrivateRoute, add a log out button and a loading screen.
    ```
    render () {
        const { authenticated, loading } = this.state;
        const content = loading ? (
             <p>Loading..</p>
        ) : (
             <div>
                 { authenticated &&
                     <button onClick={()=>auth.signOut()}>Log out</button>
                 }
                 <PrivateRoute
                     exact
                     path="/"
                     component={Main}
                     authenticated={authenticated}
                     />
                 <Route exact path="/login" component={Login} />
                 <Route exact path="/signup" component={Signup} />
             </div>
         );
        return (
            <div>
                {content}
            </div>
        );
    }
    ```

1. Add a link from the log in page to sign in page.
    ```
    <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
    ```

1. Let's add styles to our page. do `yarn add material-ui@next`. Refer to
the Material UI documentation. Let's enable theme and add AppBar.
    ```
    import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
    import AppBar from 'material-ui/AppBar';
    import Toolbar from 'material-ui/Toolbar';
    import Typography from 'material-ui/Typography';

    const theme = createMuiTheme();

    return (
            <MuiThemeProvider theme={theme}>
                <div>
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <Typography variant="title" color="inherit">
                                Simple Note
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    { content }
                </div>
            </MuiThemeProvider>
        );
    ```

1. Beautify the log in page
    ```
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

    render() {
        const { email, password } = this.state;
        const classes = this.props.classes;
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <h1>Log in</h1>
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
                            <Button variant="raised" color="primary" type="submit">Log in</Button>
                        </form>
                        <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
    ```

1. Do the same for the sign up page.
1. Now let add a spinner and a better log out button to the app page.
    ```
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
                                <Button variant="raised" color="default" onClick={() => auth.signOut()}>Log out</Button>
                            }
                        </Toolbar>
                    </AppBar>
                    { content }
                </div>
            </MuiThemeProvider>
         );
    }
    ```

1. Now work on the Main page. Need `yarn add @material-ui/icons`.
    ```
    import React, { Component } from 'react';
    import { auth, db } from '../firebase';
    import { withStyles } from 'material-ui/styles';

    import Button from 'material-ui/Button';
    import Grid from 'material-ui/Grid';
    import Paper from 'material-ui/Paper';
    import TextField from 'material-ui/TextField';
    import IconButton from 'material-ui/IconButton';
    import DeleteIcon from '@material-ui/icons/Delete';
    import List, {
     ListItem,
     ListItemText,
     ListItemSecondaryAction,
    } from 'material-ui/List';

    const styles = theme => ({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing.unit * 2,
            textAlign: 'left',
            color: theme.palette.text.secondary,
        },
        container: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        textField: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            width: 200,
        },
        list: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            maxWidth: 360,
            maxHeight: 200,
            overflow: 'auto',
        },

    });

        class Main extends Component {
            constructor(props) {
                super(props);
                this.state = {
                    notes : [],
                    current : ""
                };
                this.addNote = this.addNote.bind(this);
                this.handleChange = this.handleChange.bind(this);
            }

            componentWillMount() {
                const uid = auth.currentUser.uid;
                let notesRef = db.ref('notes/' + uid).orderByKey().limitToLast(100);
                notesRef.on('child_added', snapshot => {
                    let note = { text: snapshot.val(), id: snapshot.key };
                    this.setState({ notes: [note].concat(this.state.notes) });
                })
            }

            handleChange = name => event => {
                this.setState({
                    [name]: event.target.value,
                });
            };

            addNote(e) {
                e.preventDefault();
                const uid = auth.currentUser.uid;
                db.ref('notes/' + uid).push(this.state.current);
                this.setState({ current : "" });
            }

            render() {
                const classes = this.props.classes;
                return (
                    <Grid container className={classes.container}>
                        <Grid item xs={6}>
                            <Paper className={classes.paper}>
                                <p>Hello, { auth.currentUser.email }</p>
                                    <List className={classes.list}>
                                        { /* Render the list of messages */
                                            this.state.notes.map( (note,index) =>
                                                <ListItem key={note.id}>
                                                    <ListItemText primary={(index+1) + '. ' + note.text}/>
                                                    <ListItemSecondaryAction>
                                                      <IconButton aria-label="Delete">
                                                        <DeleteIcon />
                                                      </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem> )
                                        }
                                    </List>
                                    <form onSubmit={this.addNote}>
                                        <TextField
                                            id="note"
                                            label="Enter new note"
                                            className={classes.textField}
                                            value={this.state.current}
                                            onChange={this.handleChange('current')}
                                            margin="normal"
                                            />
                                        <br />
                                        <Button variant="raised" color="primary" type="submit">Add</Button>
                                    </form>
                            </Paper>
                        </Grid>
                    </Grid>
                );
            }
        }
    export default withStyles(styles)(Main);
    ```

1. Let's deploy to firebase hosting service. `npm install -g firebase-tools`
`firebase login` `firebase init` and set public directory to `build`.
1. do `yarn build` and `firebase deploy`.
1. Enjoy your first app :)
# hackathon-1
