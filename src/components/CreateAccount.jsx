import React, { Component } from 'react'
import firebase from 'firebase'

import {
  TextField,
  FlatButton,
  Dialog,
  Card,
  CardHeader,
  CardText,
  CardActions,
} from 'material-ui'

const styles = {
  root: {
    padding: '0 3vw',
    width: '94vw',
  },
  error: {
    color: 'red',
  },
  field: {
    root: {
      textAlign: 'center',
    },
    button: {
      width: '40vw',
    },
  },
  dialog: {
    width: '100vw',
  },
}

export default class CreateAccount extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    message: '',
    dialogFlag: false,
  }

  /**
   * アカウント作成
   */
  createUser = () => {
    this.setState({
      dialogFlag: false,
    })
    const { name, email, password } = this.state
    firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
      const newUser = {
        name: name,
        email: email,
        enter_datetime: firebase.database.ServerValue.TIMESTAMP,
      }
      firebase.database().ref('users/' + user.uid).set(newUser).then(() => {
        // Todo
      }, err => {
        console.log(err)
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
    const createActions = [
      <FlatButton
        label='CANCEL'
        secondary={true}
        onTouchTap={() => this.setState({dialogFlag: false})}
      />,
      <FlatButton
        label='OK'
        primary={true}
        onTouchTap={() => this.createUser()}
      />
    ]

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

    const disabled = 
      name === '' ||
      email === '' ||
      password === '' ||
      nameErrorMessage !== '' ||
      emailErrorMessage !== '' ||
      passwordErrorMessage !== '' ||
      message !== ''

    return (
      <div style={styles.root}>
        <Card>
          <CardHeader
            title='CREATE ACCOUNT'
          />
          <div style={styles.field.root}>
            <CardText>
              {message !== '' ? <div style={styles.error}><br />{message}</div> : null}
              <TextField
                hintText='name'
                floatingLabelText='name'
                fullWidth={true}
                value={name}
                onChange={e => {
                  const value = e.target.value
                  this.setState({
                    name: value,
                    nameErrorMessage: this.checkName(value),
                    message: '',
                  })
                }}
                errorText={nameErrorMessage !== '' ? nameErrorMessage : null}
              />
              <br />
              <TextField
                hintText='email'
                floatingLabelText='email'
                type='email'
                fullWidth={true}
                value={email}
                onChange={e => {
                  const value = e.target.value
                  this.setState({
                    email: value,
                    emailErrorMessage: this.checkEmail(value),
                    message: '',
                  })
                }}
                errorText={emailErrorMessage !== '' ? emailErrorMessage : null}
              />
              <br />
              <TextField
                hintText='password'
                floatingLabelText='password'
                type='password'
                fullWidth={true}
                value={password}
                onChange={e => {
                  const value = e.target.value
                  this.setState({
                    password: value,
                    passwordErrorMessage: this.checkPassword(value),
                    message: '',
                  })
                }}
                errorText={passwordErrorMessage !== '' ? passwordErrorMessage : null}
              />
            </CardText>
            <CardActions>
              <FlatButton
                label='RETURN'
                secondary={true}
                style={styles.field.button}
                onTouchTap={() => location.href = '#'}
              />
              <span> </span>
              <FlatButton
                label='OK'
                primary={true}
                disabled={disabled}
                style={styles.field.button}
                onTouchTap={() => this.setState({dialogFlag: true})}
              />
            </CardActions>
          </div>
        </Card>
        <Dialog
          title='CREATE ACCOUNT'
          modal={true}
          open={dialogFlag}
          contentStyle={styles.dialog}
          actions={createActions}
          onRequestClose={() => this.setState({dialogFlag: false})}
        >
          We created a new account
        </Dialog>
      </div>
    )
  }
}
