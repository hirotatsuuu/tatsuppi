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

export default class CreateAccount extends Component {
  state = {
    buttonFlag: true,
  }

  /**
   * アカウント作成
   */
  createUser = () => {
    console.log('createUser')
    const { email, password } = this.state
    firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
      const newUser = {
        name: this.state.name,
        email: this.state.email,
        enter_datetime: firebase.database.ServerValue.TIMESTAMP,
      }
      firebase.database().ref('users/' + user.uid).set(newUser).then(() => {
        location.href='#'
      })
    }, err => {
      switch (err.code) {
        case 'auth/email-already-in-use':
          this.setState({
            emailErrorMessage: '入力されたメールアドレスは既に使われています'
          })
          break
        case 'auth/invalid-email':
          this.setState({
            emailErrorMessage: '入力されたメールアドレスは使用できません'
          })
          break
        case 'auth/operation-not-allowed':
          this.setState({
            emailErrorMessage: '入力されたメールアドレスは有効ではありません'
          })
          break
        case 'auth/weak-password':
          this.setState({
            passwordErrorMessage: 'パスワードが弱すぎます'
          })
          break
        default:
          break
      }
    })
  }

  /**
   * 名前チェック
   */
  checkName = value => {
    if (value === '') {
      this.setState({
        nameErrorMessage: '名前が未入力です'
      })
    } else {
      this.setState({
        nameErrorMessage: ''
      })
    }
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
    })
  }

  render() {
    const {
      emailErrorMessage,
      passwordErrorMessage,
      nameErrorMessage
    } = this.state
    const disabled = !(
      emailErrorMessage === '' &&
      passwordErrorMessage === '' &&
      nameErrorMessage === '')

    return (
      <div style={styles.root}>
        <div>CreateAccount</div>
        <TextField
          hintText='name'
          floatingLabelText='name'
          value={this.state.name}
          onChange={e => {
            this.checkName(e.target.value),
            this.setState({name: e.target.value})
          }}
          errorText={this.state.nameErrorMessage !== '' ? this.state.nameErrorMessage : null}
        />
        <br />
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
            this.setState({ password: e.target.value })
          }}
          errorText={this.state.passwordErrorMessage !== '' ? this.state.passwordErrorMessage : null}
        />
        <br /><br />
        <FlatButton
          label='return'
          onTouchTap={() => location.href = '#'}
          secondary={true}
        />
        <span> </span>
        <RaisedButton
          label='enter'
          onClick={() => this.createUser()}
          disabled={disabled}
        />
      </div>
    )
  }
}
