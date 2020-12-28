import './App.css';
import SignupPage from './components/SignupPage'
import LoginPage from './components/LoginPage'
import user from './js/User'
import groupomania from './js/Groupomania'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import HomePage from './components/HomePage'
import { useState, useEffect } from 'react';
import Toast from './components/Toast'
import News from './components/News'
import SettingPage from './components/SettingPage'

function App() {

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setConnected(false)
    } else {
      setConnected(true)
      user.setToken(localStorage.getItem('token'))
      groupomania.setToken(user.token)
    }
  })

  const [connected, setConnected] = useState(user.isConnected())
  const [notifications, setNotifications] = useState({})

  const notif = () => (
    <div className='notifications'>z
        {
          Object.keys(notifications).map((key) => (<Toast onDelete={() => handleDeleteNotif(key)} key={key} title={notifications[key].title} message={notifications[key].message} />))
        }
      </div>)


  const handleAddNotif = (title, message) => {
    const listNotif = {...notifications}
    const key = Date.now()
    listNotif[`${key}`] = {title: title ,message: message}
    setNotifications(listNotif)
  }

  const handleDeleteNotif = (key) => {
    const listNotif = {...notifications}
    delete listNotif[key]
    setNotifications(listNotif)
  }

  const Root = 
    <>
      {(Object.keys(notifications).length > 0) ? notif() : ''}
      <BrowserRouter>
        <Switch>
          <Route exact path='/'>{connected ? <HomePage user={user} groupomania={groupomania} /> : <Redirect to='/login' />}</Route>
          <Route path='/login'>{connected ? <Redirect to='/' /> : <LoginPage addNotif={handleAddNotif} onConnect={setConnected} user={user} groupomania={groupomania} />}</Route>
          <Route path='/signup'>{connected ? <Redirect to='/' /> : <SignupPage addNotif={handleAddNotif} />}</Route>
          <Route path={'/setting'}>{connected ? <SettingPage disconnected={setConnected} user={user} groupomania={groupomania} /> : <Redirect to={'/'} />}</Route>
        </Switch>
      </BrowserRouter>
    </>

  return (Root)
}

export default App;
