import React, { Component } from 'react'
import firebase from 'firebase'

import {
  TextField,
  RaisedButton,
  FlatButton,
  Dialog,
} from 'material-ui'

const styles = {
  root: {
    padding: '65px 1vw 1vh',
    width: '98vw',
  },
}

export default class ChangeAccount extends Component {
  componentWillMount = () => {
    this.setState({
      authUid: firebase.auth().currentUser.uid,
      name: '',
      emai: '',
      nameErrorMessage: '',
      emailErrorMessage: '',
      message: '',
      dialogFlag: false,
    })
  }

  componentDidMount = () => {
    const { authUid } = this.state
    this.usersRef = firebase.database().ref('users/' + authUid)
    this.usersRef.on('value', snapshots => {
      this.setState({
        user: snapshots.val(),
      })
    })
  }

  componentWillUnmount = () => {
    this.usersRef.off('value')
  }

  /**
   * アカウント情報の挿入
   */
  setAccount = () => {
    const { user } = this.state
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
    this.setState({
      dialogFlag: true,
    })
  }

  render() {
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
        {message !== '' ? <div style={styles.error}><br />{message}</div> : null}
        <TextField
          hintText='name'
          floatingLabelText='name'
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
        <br /><br />
        <RaisedButton
          label='OK'
          onTouchTap={() => this.updateUser()}
          disabled={disabled}
          primary={true}
        />
        <Dialog
          title='update account'
          actions={[
            <FlatButton
              label='OK'
              onTouchTap={() => this.setState({
                dialogFlag: false,
              })}
            />
          ]}
          modal={true}
          open={dialogFlag}
          onRequestClose={() => this.setState({
            dialogFlag: false,
          })}
        >
          Updated Account
        </Dialog>
      </div>
    )
  }
}
