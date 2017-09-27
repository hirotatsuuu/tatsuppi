import React, { Component } from 'react'
import firebase from 'firebase'

import Routes from './Routes'
import Main from './Main'
import Login from './Login'

export default class App extends Component {
  state = {
    loginFlag: null,
  }

  componentDidMount = () => {
    firebase.auth().onIdTokenChanged(auth => {
      if (auth !== null) {
        this.setState({
          loginFlag: true,
        })
        firebase.database().ref('users/' + auth.uid).once('value', snapshot => {
          location.href = snapshot.val().state !== undefined ? '#' + snapshot.val().state : '#home'
        })
      } else {
        this.logoutAuth()
      }
    })
  }

  /**
   * ログイン処理
   */
  loginAuth = () => {
    this.setState({
      loginFlag: true,
    })
    location.href='#home'
  }

  /**
   * ログアウト処理
   */
  logoutAuth = () => {
    this.setState({
      loginFlag: false,
    })
    location.href='#'
  }

  render() {
    const { loginFlag } = this.state

    return (
      <div>
        {loginFlag !== null ? loginFlag ?
          <Main logoutAuth={this.logoutAuth} /> :
          <Login loginAuth={this.loginAuth} /> : null}
        <Routes loginFlag={loginFlag} />
      </div>
    )
  }
}
