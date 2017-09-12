import React, { Component } from 'react'
import firebase from 'firebase'

export default class ChangePassword extends Component {
  state = {
    password: '',
    rePassword: '',
    message: '',
    passwordErrorMessage: '',
    rePasswordErrorMessage: '',
    buttonFlag: true,
  }

  /**
   * ボタン活性制御
   */
  checkForm = (passwordErrorMessage, rePasswordErrorMessage) => {
    if (passwordErrorMessage !== '' || rePasswordErrorMessage !== '') {
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
      <div>
        <div>ChangePassword</div>
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
          label='enter'
          onTouchTap={() => location.href='#'}
          disabled={this.state.buttonFlag}
        />
      </div>
    )
  }
}
