import React, { Component } from 'react'
import firebase from 'firebase'

import {
  TextField,
  RaisedButton,
  FlatButton,
} from 'material-ui'

const styles = {
  root: {
    padding: '10px',
    width: '100%',
  },
  error: {
    color: 'red',
  },
}

export default class Login extends Component {
  state = {
    loginFormFlag: true,
    buttonFlag: true,
  }

  constructor(props) {
    super(props)
  }

  /**
   * ログイン処理
   */
  loginAuth = () => {
    const [email, password] = [
      this.state.email,
      this.state.password,
    ]
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      this.props.loginAuth()
    }, err => {
      let message = ''
      switch (err.code) {
        case 'auth/invalid-email':
          message = '入力されたメールアドレスは有効ではありません'
          break
        case 'auth/user-disabled':
          message = '入力されたメールアドレスは有効ではありません'
          break
        case 'auth/user-not-found':
          message = 'メールアドレスが間違っています'
          break
        case 'auth/wrong-password':
          message = 'パスワードが間違っています'
          break
        default:
          break
      }
      this.setState({
        message: message,
      })
    })
  }

  /**
   * ログイン画面以外に遷移した時の表示制御
   */
  changeHash = () => {
    console.log('changeHash', location.hash.slice(2))
    if (location.hash.slice(2) === '') {
      this.setState({
        loginFormFlag: true,
      })
    } else {
      this.setState({
        loginFormFlag: false,
      })
    }
  }

  /**
   * ボタン活性制御
   */
  checkForm = (emailErrorMessage, passwordErrorMessage) => {
    if (emailErrorMessage === '' && passwordErrorMessage === '') {
      this.setState({
        buttonFlag: false,
      })
    } else {
      this.setState({
        buttonFlag: true,
      })
    }
    this.setState({
      message: '',
    })
  }

  /**
   * メールアドレスチェック
   */
  checkEmail = event => {
    const value = event.target.value
    let message = ''
    if (value === '') {
      message = 'メールアドレスが未入力です'
    } else if (value.indexOf('@') === -1 || value.indexOf('.') === -1) {
      message = 'メールアドレスの形式が不適切です'
    }
    this.checkForm(message, this.state.passwordErrorMessage)
    this.setState({
      emailErrorMessage: message,
    })
  }

  /**
   * パスワードチェック
   */
  checkPassword = event => {
    const value = event.target.value
    let message = ''
    if (value === '') {
      message = 'パスワードが未入力です'
    } else if (value.length < 6) {
      message = 'パスワードは6文字以上で入力してください'
    }
    this.checkForm(this.state.emailErrorMessage, message)
    this.setState({
      passwordErrorMessage: message,
    })
  }

  render () {
    return (
      <div style={styles.root}>
        {window.onhashchange = this.changeHash}
        {this.state.loginFormFlag ? <div>
          <div>Login</div>
          {this.state.message !== '' ? <div style={styles.error}>{this.state.message}</div> : null}
          <TextField
            hintText='email'
            floatingLabelText='email'
            type='email'
            value={this.state.email}
            onChange={event => {
              this.checkEmail(event),
              this.setState({email: event.target.value})
            }}
            errorText={this.state.emailErrorMessage !== '' ? this.state.emailErrorMessage : null}
          />
          <br />
          <TextField
            hintText='password'
            floatingLabelText='password'
            type='password'
            value={this.state.password}
            onChange={event => {
              this.checkPassword(event),
              this.setState({password: event.target.value})
            }}
            errorText={this.state.passwordErrorMessage !== '' ? this.state.passwordErrorMessage : null}
          />
          <br /><br />
          <RaisedButton
            label='login'
            onTouchTap={() => this.loginAuth}
            disabled={this.state.buttonFlag}
          />
          <br />
          <FlatButton
            label='パスワードを忘れた方はこちら'
            onTouchTap={() => location.href='#forgotpassword'}
            secondary={true}
          />
          <br />
          <FlatButton
            label='はじめての方はこちら'
            onTouchTap={() => location.href='#createaccount'}
            primary={true}
          />
        </div> : null}
      </div>
    )
  }
}
