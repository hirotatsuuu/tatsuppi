import React, { Component } from 'react'
import firebase from 'firebase'

import {
  TextField,
  RaisedButton,
  FlatButton,
  Dialog,
} from 'material-ui'

const styles = {
  root: {
    padding: '5vh 5vw',
    width: '90vw',
  },
  error: {
    color: 'red',
  },
}

export default class CreateAccount extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    dialogFlag: false,
  }

  /**
   * アカウント作成
   */
  createUser = () => {
    const { name, email, password } = this.state
    firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
      const newUser = {
        name: name,
        email: email,
        enter_datetime: firebase.database.ServerValue.TIMESTAMP,
      }
      firebase.database().ref('users/' + user.uid).set(newUser).then(() => {
        this.setState({
          dialogFlag: true,
        })
      })
    }, err => {
      this.setState({
        message: this.checkErrorCode(err.code),
      })
    })
  }

  /**
   * ダイアログを閉じたときの処理
   */
  closeDialog = () => {
    this.setState({
      dialogFlag: false,
    })
    location.href='#'
  }

  /**
   * エラーコードチェック
   */
  checkErrorCode = code => {
    let message = ''
    switch (code) {
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
    return message
  }

  /**
   * 名前チェック
   */
  checkName = value => {
    let message = ''
    if (value === '') {
      message = '名前が未入力です'
    }
    return message
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
    return message
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
    return message
  }

  render() {
    const {
      name,
      email,
      password,
      nameErrorMessage,
      emailErrorMessage,
      passwordErrorMessage,
      message,
      dialogFlag,
    } = this.state

    const disabled = !(
      nameErrorMessage === '' &&
      emailErrorMessage === '' &&
      passwordErrorMessage === '')

    return (
      <div style={styles.root}>
        <div>CreateAccount</div>
        {message !== '' ? <div style={styles.error}><br />{message}</div> : null}
        <TextField
          hintText='name'
          floatingLabelText='name'
          value={name}
          onChange={e => {
            const value = e.target.value
            this.setState({
              name: value,
              nameErrorMessage: this.checkName(value),
            })
          }}
          errorText={nameErrorMessage !== '' ? nameErrorMessage : null}
        />
        <br />
        <TextField
          hintText='email'
          floatingLabelText='email'
          type='email'
          value={email}
          onChange={e => {
            const value = e.target.value
            this.setState({
              email: value,
              emailErrorMessage: this.checkEmail(value),
            })
          }}
          errorText={emailErrorMessage !== '' ? emailErrorMessage : null}
        />
        <br />
        <TextField
          hintText='password'
          floatingLabelText='password'
          type='password'
          value={password}
          onChange={e => {
            const value = e.target.value
            this.setState({
              password: value,
              passwordErrorMessage: this.checkPassword(value),
            })
          }}
          errorText={passwordErrorMessage !== '' ? passwordErrorMessage : null}
        />
        <br /><br />
        <FlatButton
          label='RETURN'
          onTouchTap={() => location.href = '#'}
          secondary={true}
        />
        <span> </span>
        <RaisedButton
          label='OK'
          onTouchTap={() => this.createUser()}
          disabled={disabled}
          primary={true}
        />
        <Dialog
          title='create account'
          actions={[
            <FlatButton
              label='OK'
              onTouchTap={() => this.closeDialog()}
            />
          ]}
          modal={true}
          open={dialogFlag}
          onRequestClose={() => this.closeDialog()}
        >
          Created Account
        </Dialog>
      </div>
    )
  }
}
