import React, { Component } from 'react'
import firebase from 'firebase'

import {
  TextField,
  RaisedButton,
  FlatButton,
} from 'material-ui'

const styles = {
  root: {
    padding: '70px 10px 10px',
    width: '100%',
  },
}

export default class ChangePassword extends Component {
  state = {
    password: '',
    againPassword: '',
    passwordErrorMessage: '',
    againPasswordErrorMessage: '',
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
      message: '',
    })
  }

  render() {
    const {
      password,
      againPassword,
      passwordErrorMessage,
      againPasswordErrorMessage,
    } = this.state
    const disabled = !(passwordErrorMessage === '' && againPasswordErrorMessage === '') || password === '' || againPassword === ''

    return (
      <div style={styles.root}>
        <TextField
          hintText='password'
          floatingLabelText='password'
          type='password'
          value={this.state.password}
          onChange={e => {
            this.checkPassword(e.target.value),
            this.setState({password: e.target.value})
          }}
          errorText={this.state.passwordErrorMessage !== '' ? this.state.passwordErrorMessage : null}
        />
        <br />
        <TextField
          hintText='againPassword'
          floatingLabelText='againPassword'
          type='password'
          value={this.state.againPassword}
          onChange={e => {
            this.checkPassword(e.target.value),
            this.setState({againPassword: e.target.value})
          }}
          errorText={this.state.againPasswordErrorMessage !== '' ? this.state.againPasswordErrorMessage : null}
        />
        <br /><br />
        <RaisedButton
          label='OK'
          onTouchTap={() => location.href='#'}
          disabled={disabled}
        />
      </div>
    )
  }
}
