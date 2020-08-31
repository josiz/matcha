import React, { useState, useEffect } from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom';

import io from 'socket.io-client';
import './App.css';
import Header from './views/Header/Header';
import Index from './views/Index/Index';
import MyProfile from './views/MyProfile/MyProfile';
import MyLikes from './views/MyProfile/MyLikes';
import MyVisits from './views/MyProfile/MyVisits';
import Map from './views/Map/Map';

import Chat from './views/Chat/Chat';

import {getUser} from './modules/userData';

import {getToken} from './modules/userData';

/* eslint-disable */

function App() {
  let user = getUser();

  const [state, setState] = useState(user);
  const [popupState, setPopupState] = useState(false);
  const [socketState, setSocketState] = useState(null);
  
  // Logging in to the web socket thing..

  let socket = null;

  useEffect(() => {
    if (getToken() != "null" && getToken())
    {
      socket = io.connect('/');
      socket.emit('logIn', {token: getToken()});
      setSocketState(socket);
    }
  }, [state]);

  //console.error = () => {};

  return (
    <>
      <BrowserRouter>
        <Header state={state} setState={setState} popupState={popupState} setPopupState={setPopupState} socketState={socketState}/>
        {getToken() != "null" && getToken() ?
        <>
          <Chat socket={socketState} /> 
        </> : ''}
        <Switch>

          <Route path='/myProfile/profile'>
            <MyProfile setState={setState} state={state} />
          </Route>

          <Route path='/myProfile/likes'>
            <MyLikes setState={setState} state={state} />
          </Route>

          <Route path='/myProfile/visits'>
            <MyVisits setState={setState} state={state} />
          </Route>

          <Route path='/confirmEmail'>
            <Index state={state} action='confirmEmail' setPopupState={setPopupState} />
          </Route>

          <Route path='/resetPassword'>
            <Index state={state} action='resetPassword' setPopupState={setPopupState} />
          </Route>

          <Route path='/apiLogin'>
            <Index state={state} setState={setState} action='apiLogin' setPopupState={setPopupState} />
          </Route>

          <Route path='/apiRegister'>
            <Index state={state} action='apiRegister' setPopupState={setPopupState} />
          </Route>

          <Route path='/map'>
            <Map />
          </Route>

          <Route path='/'>
            <Index state={state} />
          </Route>

        </Switch>

      </BrowserRouter>
    </>
  );
}

export default App;
