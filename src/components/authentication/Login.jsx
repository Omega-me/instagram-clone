import { Button, Modal, Input, Avatar, IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { auth } from '../../libs/firebase';
import './Login.css';
import ImageUpload from '../storage/ImageUpload';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: 400,
    backgroundColor: 'white',
    outline: 'none',
    borderRadius: '5px',
    padding: theme.spacing(2, 4, 3),
  },
  signUpButton: {
    width: '100px',
    margin: '15px',
    textTransform: 'Capitalize',
  },
  login__loginButton: {
    margin: '0 10px',
    marginBottom: '10px',
    textTransform: 'Capitalize',
  },
  avatar: {
    marginRight: '10px',
  },
}));

const Login = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [createPost, setCreatepost] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    //onAuthStateChanged() will keep you loged in if youare logged in even after you refresh the page thats why we use
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        //user has logged in ...
        //console.log(authUser.displayName);
        setUser(authUser);

        if (authUser.displayName) {
          setUsername(authUser.displayName);
          //if the user have a disaply name dont update username
        } else {
          //if we just created a user set the display name to username from our form
          return authUser.updateProfile({
            //authUser.updateProfile() can return an object with data that we want to change or add to user authentication on firebase such as display name ore phone numer etc...
            displayName: username,
          });
        }
      } else {
        //user has logged out...
        setUser(null);
      }
    });
    return () => {
      //perforem some cleanup action
      unsubscribe();
    };
  }, [user, username]);
  //we run this useeEffect() hook when we change user ore username because authUser is linked with user when we are setting setUser(authUser) and we are setting the display name of the user that will be displayed on app as username that we type on the form when we signup so displayName=username

  //create user when click button
  const signUp = e => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        authUser.user.updateProfile({
          displayName: username,
        });
        setEmail('');
        setPassword('');
        //setUsername('');
        setOpen(false);
        setOpenSignIn(false);
      })
      .catch(error => alert(error.message));
  };

  const signIn = e => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setOpen(false);
        setOpenSignIn(false);
        setPassword('');
        setUsername('');
        setEmail('');
      })
      .catch(error => alert(error.message));
  };

  return (
    <div classes='login'>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className={classes.paper}>
          <center>
            <form className='login__form'>
              <img
                className='login__modalLogo'
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png'
                alt='logo'
              />
              <Input
                className='login__signupInput'
                type='text'
                placeholder='Username'
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <Input
                className='login__signupInput'
                type='email'
                placeholder='Email'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                className='login__signupInput'
                type='password'
                placeholder='Password'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Button
                onClick={signUp}
                variant='contained'
                color='secondary'
                className={classes.signUpButton}
                type='submit'>
                Sign Up
              </Button>
            </form>
          </center>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div className={classes.paper}>
          <center>
            <form className='login__form'>
              <img
                className='login__modalLogo'
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png'
                alt='logo'
              />
              <Input
                className='login__signupInput'
                type='email'
                placeholder='Email'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                className='login__signupInput'
                type='password'
                placeholder='Password'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Button
                onClick={signIn}
                variant='contained'
                color='secondary'
                className={classes.signUpButton}
                type='submit'>
                Sign In
              </Button>
            </form>
          </center>
        </div>
      </Modal>
      <Modal open={createPost} onClose={() => setCreatepost(false)}>
        <div className={classes.paper}>
          <center>
            <img
              className='login__modalLogo'
              src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png'
              alt='logo'
            />
            <ImageUpload username={user?.displayName} />
          </center>
        </div>
      </Modal>
      {/* Header */}
      <div className='login__loginContainer'>
        {user ? (
          <div className='login__loginInformations'>
            <IconButton
              className={classes.login__loginButton}
              style={{
                marginTop: '10px',
              }}
              onClick={() => setCreatepost(true)}>
              <AddCircleIcon />
            </IconButton>
            <Button
              className={classes.login__loginButton}
              style={{
                marginTop: '10px',
              }}
              variant='contained'
              color='primary'
              onClick={() => {
                auth.signOut();
                window.location.reload();
              }}>
              Log out
            </Button>
            <Avatar className={classes.avatar}>{username.charAt(0)}</Avatar>
          </div>
        ) : (
          <div>
            <Button
              className={classes.login__loginButton}
              style={{
                marginTop: '10px',
              }}
              variant='contained'
              color='primary'
              onClick={() => setOpenSignIn(true)}>
              Sign In
            </Button>
            <Button
              className={classes.login__loginButton}
              style={{
                marginTop: '10px',
              }}
              variant='contained'
              color='secondary'
              onClick={() => setOpen(true)}>
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
