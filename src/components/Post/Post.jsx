import React, { useEffect, useState } from 'react';
import './Post.css';
import { Avatar, IconButton } from '@material-ui/core/';
import SendIcon from '@material-ui/icons/Send';
import { db, auth } from '../../libs/firebase';
import firebase from 'firebase';

const Post = ({ username, image, avatarImage, caption, postID }) => {
  const [comments, setComments] = useState([]);
  const [comm, setComm] = useState('');
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        setUserName(authUser.displayName);
      } else {
        setUserName(null);
      }
    });
  }, []);

  useEffect(() => {
    let unsubscribe;
    if (postID) {
      unsubscribe = db
        .collection('posts')
        .doc(postID)
        .collection('comments')
        .orderBy('commentTimestamp', 'asc')
        .onSnapshot(snapshot => {
          setComments(
            snapshot.docs.map(doc => ({
              id: doc.id,
              comment: doc.data(),
            }))
          );
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postID]);

  const postComment = e => {
    e.preventDefault();
    db.collection('posts').doc(postID).collection('comments').add({
      commentTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
      text: comm,
      username: userName,
    });
    setComm('');
  };

  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar className='post__avatar' src={avatarImage}>
          {username?.charAt(0)}
        </Avatar>
        <h3 className='post__username'>{username}</h3>
      </div>

      <img className='post__image' src={image} alt='imgPost' />

      <h4 className='post__text'>
        <strong>{username}</strong> {caption}
      </h4>
      <div className='post__comments'>
        {comments.map(({ id, comment }) => (
          <p key={id} className='post__commentText'>
            <strong className='post__commentUsername'>
              {comment.username}
            </strong>{' '}
            {comment.text}
          </p>
        ))}
      </div>
      {userName ? (
        <form className='post__commentBox'>
          <input
            className='post__input'
            type='text'
            placeholder='Add a comment...'
            value={comm}
            onChange={e => setComm(e.target.value)}
          />
          <IconButton
            className='post__button'
            disabled={!comm}
            type='submit'
            onClick={postComment}>
            <SendIcon />
          </IconButton>
        </form>
      ) : (
        <h5 className='post__logedOutComments'>Sign in to post a comment</h5>
      )}
    </div>
  );
};

export default Post;
