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

export default class ForgotPassword extends Component {
  state = {
    email: '',
    message: '',
    dialogFlag: false,
  }

  /**
   * エラーコードチェック
   */
  checkErrorCode = code => {
    let message = ''
    switch (code) {
      case 'auth/invalid-email':
        message = '入力されたメールアドレスは有効ではありません'
        break
      case 'auth/user-not-found':
        messgae = '入力されたメールアドレスに対応するアカウントが見つかりません'
        break
      default:
        message = 'メールの送信に失敗しました'
        break
    }
    return message
  }

  /**
   * パスワード再設定のメールを送信する処理
   */
  sendEmail = () => {
    const { email } = this.state
    firebase.auth().sendPasswordResetEmail(email).then(() => {
      this.closeDialog()
    }, err => {
      this.setState({
        message: this.checkErrorCode(err.code),
        dialogFlag: false,
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
      message: '',
    })
    return message
  }

  render() {
    const sendActions = [
      <FlatButton
        label='CANCEL'
        onTouchTap={() => this.setState({ dialogFlag: false })
        }
      />,
      <FlatButton
        label='OK'
        onTouchTap={() => this.sendEmail()}
      />
    ]

    const {
      email,
      emailErrorMessage,
      message,
      dialogFlag,
    } = this.state

    const disabled = email === '' || emailErrorMessage !== '' || message !== ''

    return (
      <div style={styles.root}>
        <Card>
          <CardHeader
            title='FORGOT PASSWORD'
          />
          <div style={styles.field.root}>
            <CardText>
              {message !== '' ? <div style={styles.error}>{message}</div> : null}
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
                  })
                }}
                errorText={emailErrorMessage}
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
          title='SEND PASSWORD RESET EMAIL'
          modal={true}
          open={dialogFlag}
          contentStyle={styles.dialog}
          actions={sendActions}
          onRequestClose={() => this.setState({ dialogFlag: false })
          }
        >
          We send password reset email
        </Dialog>
      </div>
    )
  }
}
