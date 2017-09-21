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

export default class UpdatePassword extends Component {
  state = {
    password: '',
    again: '',
    message: '',
    dialogFlag: false,
  }

  /**
   * パスワードの更新
   */
  updatePassword = () => {
    const { password, again } = this.state
    let message = this.checkMatchPassword(password, again)
    if (message !== '') {
      this.setState({
        message: message,
      })
    } else {
      firebase.auth().currentUser.updatePassword(password).then(() => {
        this.setState({
          dialogFlag: true,
        })
      }, err => {
        this.setState({
          message: this.checkErrorCode(err.code),
        })
      })
    }
  }

  /**
   * ダイアログを閉じたときの処理
   */
  closeDialog = () => {
    this.setState({
      dialogFlag: false,
    })
  }

  /**
   * エラーコードチェック
   */
  checkErrorCode = code => {
    let message = ''
    switch (code) {
      case 'auth/requires-recent-login':
        message = 'ログインしなおしてください'
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

  /**
   * パスワードが同じかチェック
   */
  checkMatchPassword = (value, again) => {
    let message = ''
    if (value !== again) {
      message = 'パスワードが一致していません'
    }
    return message
  }

  render() {
    const {
      password,
      again,
      passwordErrorMessage,
      againErrorMessage,
      message,
      dialogFlag,
    } = this.state

    const disabled = !(passwordErrorMessage === '' && againErrorMessage === '') || password === '' || again === ''

    return (
      <div style={styles.root}>
        <Card>
          <CardHeader
            title='UPDATE PASSWORD'
          />
          <div style={styles.field.root}>
            <CardText>
              {message !== '' ? <div style={styles.error}><br />{message}</div> : null}
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
                  })
                }}
                errorText={passwordErrorMessage !== '' ? passwordErrorMessage : null}
              />
              <br />
              <TextField
                hintText='again'
                floatingLabelText='again'
                type='password'
                fullWidth={true}
                value={again}
                onChange={e => {
                  const value = e.target.value
                  this.setState({
                    again: value,
                    againErrorMessage: this.checkPassword(value),
                  })
                }}
                errorText={againErrorMessage !== '' ? againErrorMessage : null}
              />
            </CardText>
            <CardActions>
              <RaisedButton
                label='OK'
                disabled={disabled}
                fullWidth={true}
                onTouchTap={() => this.updatePassword()}
              />
            </CardActions>
          </div>
        </Card>
        <Dialog
          title='UPDATE'
          actions={[
            <FlatButton
              label='OK'
              onTouchTap={() => this.closeDialog()}
            />
          ]}
          modal={true}
          open={dialogFlag}
          contentStyle={styles.dialog}
          onRequestClose={() => this.closeDialog()}
        >
          We updated you're password
        </Dialog>
      </div>
    )
  }
}
