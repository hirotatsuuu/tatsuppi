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

export default class ForgotPassword extends Component {
  state = {
    email: '',
    emailErrorMessage: '',
    buttonFlag: true,
  }

  /**
   * メールアドレスチェック
   */
  checkEmail = event => {
    const value = event.target.value
    let message = ''
    if (value === '') {
      message = 'メールアドレスが未入力です'
    } else if (value.indexOf('@') === -1 || value.indexOf('.') === -1) {
      message = 'メールアドレスの形式が不適切です'
    }
    this.setState({
      emailErrorMessage: message,
    })
    if (message === '') {
      this.setState({
        buttonFlag: false,
      })
    } else {
      this.setState({
        buttonFlag: true,
      })
    }
  }

  render() {
    return (
      <div style={styles.root}>
        <div>ForgotPassword(未実装)</div>
        <TextField
          hintText='email'
          floatingLabelText='email'
          type='email'
          value={this.state.email}
          onChange={event => {
            this.checkEmail(event),
            this.setState({email: event.target.value})
          }}
          errorText={this.state.emailErrorMessage !== '' ? this.state.emailErrorMessage : null}
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
          onTouchTap={() => location.href='#'}
          disabled={this.state.buttonFlag}
        />
      </div>
    )
  }
}
