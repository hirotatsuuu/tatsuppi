import React, { Component } from 'react'
import firebase from 'firebase'

import {
  FlatButton,
  Card,
  CardActions,
  Dialog,
} from 'material-ui'

import colors from './colors'

const styles = {
  root: {
    padding: '65px 1vw 65px',
    width: '98vw',
  },
  tertiary: {
    color: colors.tertiaryColor,
  },
  quaternary: {
    color: colors.quaternaryColor,
  },
  full: {
    width: '100vw',
  },
}

export default class Settings extends Component {
  state = {
    auth: firebase.auth().currentUser,
    logoutDialogFlag: false,
    lineDialogFlag: false,
  }

  componentWillMount = () => {
    localStorage.setItem('hash', location.hash.slice(2))
  }

  /**
   * ログアウトの処理
   */
  logout = () => {
    firebase.auth().signOut()
  }

  /**
   * ログアウトフォーム
   */
  Logout = () => {
    const logoutActions = [
      <FlatButton
        label='CANCEL'
        secondary={true}
        onTouchTap={() => this.setState({ logoutDialogFlag: false })}
      />,
      <FlatButton
        label='OK'
        primary={true}
        onTouchTap={() => this.logout()}
      />
    ]
    const {
      logoutDialogFlag,
    } = this.state

    return (
      <div>
        <FlatButton
          label='LOGOUT'
          fullWidth={true}
          onTouchTap={() => this.setState({ logoutDialogFlag: true })}
        />
        <Dialog
          title='LOGOUT'
          open={logoutDialogFlag}
          actions={logoutActions}
          contentStyle={styles.full}
        >
          Are you sure you want to logout ?
        </Dialog>
      </div>
    )
  }

  /**
   * LINE遷移
   */
  Line = () => {
    const lineActions = [
      <FlatButton
        label='CANCEL'
        secondary={true}
        onTouchTap={() => this.setState({ lineDialogFlag: false })}
      />,
      <FlatButton
        label='OK'
        primary={true}
        href='https://line.me/R/ti/p/%40ond8714j'
      />
    ]
    const {
      lineDialogFlag,
    } = this.state

    return (
      <div>
        <FlatButton
          label='GO TO LINE'
          labelStyle={styles.tertiary}
          fullWidth={true}
          onTouchTap={() => this.setState({ lineDialogFlag: true })}
        />
        <Dialog
          title='Go to LINE'
          open={lineDialogFlag}
          actions={lineActions}
          contentStyle={styles.full}
        >
          Are you sure you want to go to LINE ?
        </Dialog>
      </div>
    )
  }

  render() {
    return (
      <div style={styles.root}>
        <Card>
          <CardActions>
            <this.Line />
            <FlatButton
              label='UPDATE ACCOUNT'
              primary={true}
              fullWidth={true}
              onTouchTap={() => location.href = location.hash.slice(2) === 'updateaccount' ? '#home' : '#updateaccount'}
            />
            <br />
            <FlatButton
              label='UPDATE PASSWORD'
              secondary={true}
              fullWidth={true}
              onTouchTap={() => location.href='#updatepassword'}
            />
            <br />
            <FlatButton
              label='CONTACT'
              fullWidth={true}
              style={styles.quaternary}
              onTouchTap={() => location.href='#contact'}
            />
            <br />
            <this.Logout />
          </CardActions>
        </Card>
      </div>
    )
  }
}
