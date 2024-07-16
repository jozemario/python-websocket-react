import React, {useEffect} from 'react';
import {Provider, useDispatch} from 'react-redux';
import store from './redux/store';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { useSelector } from 'react-redux';
import './App.css';
import {checkStoredAuth} from "./redux/actions";

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkStoredAuth());
  }, [dispatch]);

  const isLoggedIn = useSelector(state => state.auth.isAuthenticated);

  return (
    <div className="App">
      {isLoggedIn ? <Dashboard /> : <Login />}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;