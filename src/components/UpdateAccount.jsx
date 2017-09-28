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
  state = {
    auth: firebase.auth().currentUser,
    name: '',
    emai: '',
    nameErrorMessage: '',
    emailErrorMessage: '',
    message: '',
    dialogFlag: false,
  }

  componentWillMount = () => {
    const { auth } = this.state
    const state = {
      state: location.hash.slice(2),
    }
    firebase.database().ref('users/' + auth.uid).update(state)
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
   * 更新オブジェクトの作成
   */
  makeAccountObject = () => {
    const { name, email } = this.state
    const user = {
      name: name,
      email: email,
    }
    return user
  }

  /**
   * アカウント情報の更新
   */
  updateUser = () => {
    const { email, auth } = this.state
    this.setState({
      dialogFlag: false,
    })
    auth.updateEmail(email).then(() => {
      const user = this.makeAccountObject()
      this.userRef.update(user).then(() => {
        const state = {
          message: 'UPDATE ACCOUNT',
        }
        firebase.database().ref('state/' + auth.uid).set(state).then(() => {
        location.href = '#home'
        }, err => {
          console.log(err)
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
        label='CANCEL'
        secondary={true}
        onTouchTap={() => this.setState({ dialogFlag: false })}
      />,
      <FlatButton
        label='OK'
        primary={true}
        onTouchTap={() => this.updateUser()}
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
                onTouchTap={() => this.setState({dialogFlag: true})}
              />
            </CardActions>
          </div>
        </Card>
        <Dialog
          title='UPDATE ACCOUNT'
          actions={updateActions}
          open={dialogFlag}
          contentStyle={styles.dialog}
          onRequestClose={() => this.setState({dialogFlag: false})}
        >
          Are you sure you want to update your account ?
        </Dialog>
      </div>
    )
  }
}
