import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../lib/context';
import Image from 'next/image';
const debounce = require('lodash.debounce');
import firebase from 'firebase/app';

export default function EnterPage() {
  const { user, username } = useContext(UserContext);
  //1 user signed out <SignInButton>
  //2 user signed in  <usernameForm> => <SignOutButton>
  //3 user signed in, has username <SignOutButton>
  const submitNewPost = async () => {
    const { serverTimestamp } = firebase.firestore.FieldValue;
    const batch = firestore.batch();
    for (let i = 3; i <= 20; i++) {
      const con = 'a loi dep zai siu cap vu tru ' + i;
      const slug = con.split(' ').join('-');
      const postDoc = firestore.doc(`users/${user.uid}/posts/${slug}`);
      batch.set(postDoc, {
        content: con,
        createdAt: serverTimestamp(),
        heartCount: Math.floor(Math.random() * 10),
        published: true,
        slug: slug,
        title: 'a Loi dz waaaa" ' + i,
        updatedAt: serverTimestamp(),
        username: 'lvl',
      });
    }
    const res = await batch.commit();
    console.log(res);
  };
  return (
    <main>
      {user ? (
        username ? (
          <SignOutButton />
        ) : (
          <UsernameForm />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

const SignInButton = () => {
  const signInWithGoogle = async () => {
    const info = await auth.signInWithPopup(googleAuthProvider);
  };
  return (
    <button className='btn-google' onClick={signInWithGoogle}>
      <Image src='/google.png' className='google-logo' width={50} height={50}></Image>
      <style jsx global>{`
        .google-logo {
          border-radius: 50%;
          width: 50px;
          height: 50px;
          cursor: pointer;
        }
      `}</style>
      Sign in with Google
    </button>
  );
};
const SignOutButton = () => {
  return (
    <button
      className='btn-blue'
      onClick={async () => {
        console.log('click');
        await auth.signOut();
      }}
    >
      Sign out
    </button>
  );
};

const UsernameForm = () => {
  const [formValue, setFormValue] = useState('');
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  // reload van co the debounce
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        // not exist -> valid
        setValid(!exists);
        setLoading(false);
      }
    }, 300),
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    const batch = firestore.batch();
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });
    await batch.commit();
  };

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setValid(false);
    } else {
      setFormValue(val);
      setLoading(true);
      setValid(false);
    }
  };
  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name='username'
            placeholder='Enter your username'
            value={formValue}
            onChange={onChange}
          ></input>
          <UsernameMessage
            username={formValue}
            valid={valid}
            loading={loading}
          />
          <button type='submit' className='btn-green'>
            Choose
          </button>
        </form>
        <h3>Debug</h3>
        <p>username {formValue}</p>
        <br></br>
        <p>loading {loading}</p>
        <br></br>
        <p>valid {valid}</p>
        <br></br>
      </section>
    )
  );
};

const UsernameMessage = ({ username, valid, loading }) => {
  if (loading) {
    return <p>Checking...</p>;
  } else if (valid) {
    return <p className='text-success'>{username} is available!</p>;
  } else if (username && !valid) {
    return <p className='text-danger'>That username is taken!</p>;
  } else {
    return <p></p>;
  }
};
