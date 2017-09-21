import React, { Component } from 'react'
import firebase from 'firebase'

import {
  TextField,
  RaisedButton,
  FlatButton,
  Dialog,
  Card,
  CardHeader,
  CardText,
  CardActions,
} from 'material-ui'

const styles = {
  root: {
    padding: '65px 1vw 1vh',
    width: '98vw',
  },
  error: {
    color: 'red',
  },
  field: {
    root: {
      textAlign: 'center',
    },
  },
  dialog: {
    width: '100vw',
  },
}

export default class UpdateAccount extends Component {
  componentWillMount = () => {
    this.setState({
      auth: firebase.auth().currentUser,
      name: '',
      emai: '',
      nameErrorMessage: '',
      emailErrorMessage: '',
      message: '',
      dialogFlag: false,
    })
  }

  componentDidMount = () => {
    const { auth } = this.state
    this.userRef = firebase.database().ref('users/' + auth.uid)
    this.userRef.on('value', snapshots => {
      this.setAccount(snapshots.val())
    })
  }

  componentWillUnmount = () => {
    this.userRef.off('value')
  }

  /**
   * アカウント情報の挿入
   */
  setAccount = user => {
    this.setState({
      name: user.name,
      email: user.email,
    })
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
   * アカウント情報の更新
   */
  updateUser = () => {
    const { name, email, auth } = this.state
    auth.updateEmail(email).then(() => {
      const userObj = {
        name: name,
        email: email,
      }
      this.userRef.update(userObj).then(() => {
        this.setState({
          dialogFlag: true,
        })
      }, err => {
        console.log(err)
      })
    }, err => {
      this.setState({
        message: this.checkEmailErrorCode(err.code),
      })
    })
  }

  /**
   * エラーコードチェック
   */
  checkEmailErrorCode = code => {
    let message = ''
    switch (code) {
      case 'auth/invalid-email':
        message = '入力されたメールアドレスは無効です'
        break
      case 'auth/email-already-in-use':
        message = '入力されたメールアドレスは既に使われています'
        break
      case 'auth/requires-recent-login':
        message = 'ログインしなおしてください'
        break
      default:
        break
    }
    return message
  }

  render() {
    const updateActions = [
      <FlatButton
        label='OK'
        onTouchTap={() => (
          this.setState({ dialogFlag: false }),
          location.href = '#home'
        )}
      />
    ]

    const {
      name,
      email,
      nameErrorMessage,
      emailErrorMessage,
      message,
      dialogFlag,
    } = this.state

    const disabled = !(nameErrorMessage === '' && emailErrorMessage === '')

    return (
      <div style={styles.root}>
        <Card>
          <CardHeader
            title='UPDATE ACCOUNT'
          />
          <div style={styles.field.root}>
            <CardText>
              {message !== '' ? <div style={styles.error}><br />{message}</div> : null}
              <TextField
                hintText='name'
                floatingLabelText='name'
                fullWidth={true}
                value={name}
                errorText={nameErrorMessage}
                onChange={e => {
                  const value = e.target.value
                  this.setState({
                    name: value,
                    nameErrorMessage: this.checkName(value),
                  })
                }}
              />
              <br />
              <TextField
                hintText='email'
                floatingLabelText='email'
                type='email'
                fullWidth={true}
                value={email}
                errorText={emailErrorMessage}
                onChange={e => {
                  const value = e.target.value
                  this.setState({
                    email: value,
                    emailErrorMessage: this.checkEmail(value),
                  })
                }}
              />
            </CardText>
            <CardActions>
              <RaisedButton
                label='OK'
                disabled={disabled}
                fullWidth={true}
                onTouchTap={() => this.updateUser()}
              />
            </CardActions>
          </div>
        </Card>
        <Dialog
          title='UPDATE ACCOUNT'
          actions={updateActions}
          modal={true}
          open={dialogFlag}
          contentStyle={styles.dialog}
          onRequestClose={() => this.setState({
            dialogFlag: false,
          })}
        >
          It was updated account
        </Dialog>
      </div>
    )
  }
}
