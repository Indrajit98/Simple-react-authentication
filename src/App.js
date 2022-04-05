import React, { useState } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig";

//import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider,createUserWithEmailAndPassword } from "firebase/auth";
import { signOut } from "firebase/auth";


initializeApp(firebaseConfig);

function App() {
  const provider = new GoogleAuthProvider();
  const [ newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignedIn: false,
    newUser:'',
    name: "",
    email: "",
    picture: "",
    password: "",
    error:"",
    success: false,
  });

  const handleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          picture: photoURL,
        };
        setUser(signedInUser);
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then((res) => {
        const signOutUser = {
          isSignedIn: false,
          name: "",
          email: "",
          picture: "",
        };
        setUser(signOutUser);
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };
  const handleSubmit=(event) => {
    // console.log(user.email,user.password);
    if(user.email && user.password) {
      const auth = getAuth();
createUserWithEmailAndPassword(auth, user.email, user.password)
  .then((res) => {
    // Signed in 
    const successMessage="User account is success"
    const user = res.user;
    const newUserInfo = {...user};
    newUserInfo.success=successMessage;
    setUser(newUserInfo)

    // ...
    console.log(user)
  })
  .catch((error) => {
    //const errorCode = error.code;
    const errorMessage = 'The email address is use by another account'
    // ..
   // console.log(errorMessage,errorCode)
    const newUserInfo = {...user};
    newUserInfo.error= errorMessage;
    newUserInfo.success=false;
    setUser(newUserInfo)

  });
    console.log('submitted')

    }
    event.preventDefault();

  }
  const handleBlur=(event) => {
    let formValid = true;
    console.log(event.target.name, event.target.value)
    if(event.target.name === "email"){
      formValid = /\S+@\S+\.\S+/.test(event.target.value);
      // console.log(formValid)
    }
    if(event.target.name === "password"){
      const isPassword = event.target.value.length>6;
      const isPassword1 = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{1,}/.test(event.target.value)
      formValid = isPassword && isPassword1;
      // console.log(formValid)

    }
    if(formValid){
      const newUserInfo = {...user}
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo)
    }
  }

  return (
    <div className="App">
      <div>
        {user.isSignedIn ? (
          <button onClick={handleSignOut}>SignOut</button>
        ) : (
          <button onClick={handleSignIn}>SignIn</button>
        )}
        {user.isSignedIn && (
          <div>
            <h3>Name:{user.name}</h3>
            <p>Email:{user.email}</p>
            <img src={user.picture} alt="" />
          </div>
        )}
      </div>
      <div>
      <h1>Our won authentication</h1>
      <input type="checkbox" name="newUser" id="newUser" onClick={() =>setNewUser(!newUser)}/>
      <level htmlFor="newUser">New user sign up</level>
        <form onSubmit={handleSubmit} className="form">
          {newUser && <input type='name' name='name' placeholder='Your Name' onBlur={handleBlur} required></input>}<br />
          <input type='email' name='email' placeholder='Your email address' onBlur={handleBlur} required></input><br />
          <input type='password' name='password' placeholder='Your password' onBlur={handleBlur}  required></input><br />
          <input type='submit'></input>
          <p style={{color: 'red'}}>{user.error}</p>
          <p style={{color: 'green'}}>{user.success}</p>

        </form>
      </div>
    </div>
  );
}

export default App;
