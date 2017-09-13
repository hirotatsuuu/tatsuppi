import React, { Component } from 'react'
import firebase from 'firebase'

import Routes from './Routes'
import Main from './Main'
import Login from './Login'

export default class App extends Component {
  state = {
    loginFlag: false,
  }

  componentDidMount = () => {
    firebase.auth().onIdTokenChanged(loginUser => {
      if (loginUser === null) {
        this.setState({
          loginFlag: false,
        })
        location.href='#'
      } else {
        this.setState({
          loginFlag: true,
        })
        location.href='#home'
      }
    })
  }

  loginAuth = () => {
    this.setState({
      loginFlag: true,
    })
    location.href='#home'
  }

  logoutAuth = () => {
    this.setState({
      loginFlag: false,
    })
    location.href='#'
  }

  render() {
    return (
      <div>
        {this.state.loginFlag ?
          <Main logoutAuth={this.logoutAuth} /> :
          <Login loginAuth={this.loginAuth} />}
        <Routes loginFlag={this.state.loginFlag} />
      </div>
    )
  }
}
