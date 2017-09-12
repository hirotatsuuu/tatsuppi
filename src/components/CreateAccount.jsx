import React, { Component } from 'react'
import firebase from 'firebase'

import {
  TextField,
  RaisedButton,
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

export default class CreateAccount extends Component {
  state = {
    email: '',
    password: '',
    message: '',
    emailErrorMessage: '',
    passwordErrorMessage: '',
    buttonFlag: true,
  }

  createUser = () => {
    const [email, password] = [
      this.state.email,
      this.state.password,
    ]
    console.log('createUesr', email, password)
    firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
      console.log(user)
      const newUser = {
        mail_address: this.state.email,
        enter_datetime: firebase.database.ServerValue.TIMESTAMP,
      }
      firebase.database().ref('users/' + user.uid).set(newUser).then(() => {
        location.href='#'
      })
    }, err => {
      let message = ''
      switch (err.code) {
        case 'auth/email-already-in-use':
          message = '入力されたメールアドレスは既に使われています'
          break
        case 'auth/invalid-email':
          message = '入力されたメールアドレスは使用できません'
          break
        case 'auth/operation-not-allowed':
          message = '入力されたメールアドレスは有効ではありません'
          break
        case 'auth/weak-password':
          message = 'パスワードが弱すぎます'
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
   * ボタン活性制御
   */
  checkForm = (emailErrorMessage, passwordErrorMessage) => {
    if (emailErrorMessage !== '' || passwordErrorMessage !== '') {
      this.setState({
        buttonFlag: true,
      })
    } else {
      this.setState({
        buttonFlag: false,
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
    this.checkForm(message, this.state.passwordErrorMessage),
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
    this.checkForm(this.state.emailErrorMessage, message),
    this.setState({
      passwordErrorMessage: message,
    })
  }

  render() {
    return (
      <div style={styles.root}>
        <div>CreateAccount</div>
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
          label='return'
          onTouchTap={() => location.href = '#'}
          secondary={true}
        />
        <RaisedButton
          label='enter'
          onTouchTap={this.createUser}
          disabled={this.state.buttonFlag}
        />
      </div>
    )
  }
}
