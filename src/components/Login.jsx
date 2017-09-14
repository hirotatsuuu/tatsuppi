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
    email: '',
    password: '',
    emailErrorMessage: '',
    passwordErrorMessage: '',
  }

  constructor(props) {
    super(props)
  }

  componentWillMount = () => {
    // this.setState({
    //   email: 'jjj@jjj.jj',
    //   password: 'jjjjjj',
    // })
  }

  /**
   * ログイン処理
   */
  loginAuth = () => {
    const { email, password } = this.state
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      this.props.loginAuth()
    }, () => {
      this.setState({
        message: 'ログインに失敗しました',
      })
    })
  }

  /**
   * メールアドレスチェック
   */
  checkEmail = value => {
    let message = ''
    if (value === '') {
      message = 'メールアドレスが未入力です'
    } else if (value.indexOf('@') === -1 || value.indexOf('.') === -1) {
      message = 'メールアドレスの形式が不適切です'
    }
    this.setState({
      emailErrorMessage: message,
      message: '',
    })
  }

  /**
   * パスワードチェック
   */
  checkPassword = value => {
    let message = ''
    if (value === '') {
      message = 'パスワードが未入力です'
    } else if (value.length < 6) {
      message = 'パスワードは6文字以上で入力してください'
    }
    this.setState({
      passwordErrorMessage: message,
      message: '',
    })
  }

  render() {
    const loginFormFlag = location.hash.slice(2) === ''
    const {
      email,
      password,
      emailErrorMessage,
      passwordErrorMessage,
    } = this.state
    const disabled = !(emailErrorMessage === '' && passwordErrorMessage === '') || email === '' || password === ''

    return (
      <div style={styles.root}>
        {loginFormFlag ? <div>
          <div>LOGIN</div>
          {this.state.message !== '' ? <div style={styles.error}>{this.state.message}</div> : null}
          <TextField
            hintText='email'
            floatingLabelText='email'
            type='email'
            value={this.state.email}
            onChange={e => {
              this.checkEmail(e.target.value),
              this.setState({email: e.target.value})
            }}
            errorText={this.state.emailErrorMessage !== '' ? this.state.emailErrorMessage : null}
          />
          <br />
          <TextField
            hintText='password'
            floatingLabelText='password'
            type='password'
            value={this.state.password}
            onChange={e => {
              this.checkPassword(e.target.value),
              this.setState({password: e.target.value})
            }}
            errorText={this.state.passwordErrorMessage !== '' ? this.state.passwordErrorMessage : null}
          />
          <br /><br />
          <RaisedButton
            label='LOGIN'
            onTouchTap={() => this.loginAuth()}
            disabled={disabled}
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
