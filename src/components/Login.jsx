import React, { Component } from 'react'
import firebase from 'firebase'

import {
  TextField,
  RaisedButton,
  FlatButton,
  Card,
  CardHeader,
  CardText,
  CardActions,
} from 'material-ui'

const styles = {
  root: {
    padding: '1vh 3vw',
    width: '94vw',
  },
  error: {
    color: 'red',
  },
  field: {
    root: {
      textAlign: 'center',
    },
  },
}

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    message: '',
  }

  constructor(props) {
    super(props)
  }

  componentWillMount = () => {
    // this.setState({
    //   email: 'jjj@jjj.jj',
    //   password: 'jjjjjj',
    // })
  }

  /**
   * ログイン処理
   */
  loginAuth = () => {
    const { email, password } = this.state
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      this.props.loginAuth()
    }, () => {
      this.setState({
        message: 'ログインに失敗しました',
      })
    })
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
      message: '',
    })
    return message
  }

  render() {
    const loginFormFlag = location.hash.slice(2) === ''

    const {
      email,
      password,
      emailErrorMessage,
      passwordErrorMessage,
      message,
    } = this.state

    const disabled = !(emailErrorMessage === '' && passwordErrorMessage === '') || email === '' || password === ''

    return (
      <div style={styles.root}>
        {loginFormFlag ? <div>
          <Card>
            <CardHeader
              title='TATSUPPI'
            />
            <div style={styles.field.root}>
              <CardText>
                {message !== '' ? <div style={styles.error}><br />{message}</div> : null}
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
                    })
                  }}
                  errorText={passwordErrorMessage !== '' ? passwordErrorMessage : null}
                />
              </CardText>
              <CardActions>
                <RaisedButton
                  label='LOGIN'
                  fullWidth={true}
                  disabled={disabled}
                  onTouchTap={() => this.loginAuth()}
                />
                <br />
                <FlatButton
                  label='パスワードを忘れた方はこちら'
                  fullWidth={true}
                  secondary={true}
                  onTouchTap={() => location.href='#forgotpassword'}
                />
                <br />
                <FlatButton
                  label='はじめての方はこちら'
                  fullWidth={true}
                  primary={true}
                  onTouchTap={() => location.href='#createaccount'}
                />
              </CardActions>
            </div>
          </Card>
        </div> : null}
      </div>
    )
  }
}
