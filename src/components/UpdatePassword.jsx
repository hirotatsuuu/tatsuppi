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
        dialogFlag: false,
      })
    } else {
      this.setState({
        dialogFlag: false,
      })
      firebase.auth().currentUser.updatePassword(password).then(() => {
        // Todo
      }, err => {
        this.setState({
          message: this.checkErrorCode(err.code),
        })
      })
    }
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
   * 同一パスワードチェック
   */
  checkMatchPassword = (value, again) => {
    let message = ''
    if (value !== again) {
      message = 'パスワードが一致していません'
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
        onTouchTap={() => this.updatePassword()}
      />
    ]

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
                onTouchTap={() => this.setState({dialogFlag: true})}
              />
            </CardActions>
          </div>
        </Card>
        <Dialog
          title='UPDATE'
          modal={true}
          open={dialogFlag}
          contentStyle={styles.dialog}
          actions={updateActions}
          onRequestClose={() => this.setState({dialogFlag: false})}
        >
          It was updated password
        </Dialog>
      </div>
    )
  }
}
