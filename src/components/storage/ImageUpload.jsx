import { Button, IconButton, Input } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PhotoIcon from '@material-ui/icons/Photo';
import { makeStyles } from '@material-ui/core/styles';
import { db, storage } from '../../libs/firebase';
import firebase from 'firebase';
import React, { useState } from 'react';
import './ImageUpload.css';

const useStyles = makeStyles(theme => ({
  button: {
    margin: '25px',
    textTransform: 'Capitalize',
  },
}));

const ImageUpload = ({ username }) => {
  const classes = useStyles();
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadClass, setUploadClass] = useState(false);

  const handleChange = e => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setUploadClass(true);
    } else {
      setUploadClass(false);
    }
  };

  const handleUpload = e => {
    //uploading image to firebase storage
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      'state_changed',
      snapshot => {
        //progress bar function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      error => {
        // error function
        console.log(error);
        alert(error.message);
      },
      () => {
        //complete function
        //geting the download link from firebase storage
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            //post image inside db
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              image: url,
              username: username,
            });
            setCaption('');
            setProgress(0);
            setImage(null);
            setUploadClass(false);
          });
      }
    );
  };

  return (
    <div className='imageUpload'>
      <div className='imageUpload__inputs'>
        <Input
          value={caption}
          onChange={e => setCaption(e.target.value)}
          type='text'
          placeholder='Enter caption'
        />
        <input
          className='imageUpload__upload'
          id='icon-button-file'
          accept='image/*'
          type='file'
          onChange={handleChange}
        />
        <label htmlFor='icon-button-file'>
          <IconButton aria-label='upload picture' component='span'>
            <PhotoIcon color={uploadClass ? 'secondary' : 'default'} />
          </IconButton>
        </label>
      </div>

      <Button
        onClick={image && handleUpload}
        className={classes.button}
        variant='contained'
        color='default'
        startIcon={<CloudUploadIcon />}>
        Upload
      </Button>
      <progress value={progress} max='100'></progress>
    </div>
  );
};

export default ImageUpload;
