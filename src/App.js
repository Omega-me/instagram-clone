import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/authentication/Login';
import Post from './components/Post/Post';
import { db, auth } from './libs/firebase';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        setPosts(
          snapshot.docs.map(doc => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
    console.log(auth.displayName);
  }, []);

  return (
    <div className='app'>
      <div className='app__header'>
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/512px-Instagram_logo.svg.png'
          alt='logo'
          className='app__headerImage'
        />
      </div>
      <Login />
      <div className='app__posts'>
        {posts.map(({ id, post }) => (
          <div>
            <Post
              postID={id}
              key={id}
              username={post.username}
              caption={post.caption}
              image={post.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
