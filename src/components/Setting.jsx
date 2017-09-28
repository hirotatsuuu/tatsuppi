import React, { Component } from 'react'
import firebase from 'firebase'

import {
  FlatButton,
  Card,
  CardActions,
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
}

export default class Setting extends Component {
  state = {
    auth: firebase.auth().currentUser,
  }

  componentWillMount = () => {
    const { auth } = this.state
    const state = {
      state: location.hash.slice(2),
    }
    firebase.database().ref('users/' + auth.uid).update(state)
  }

  render() {
    return (
      <div style={styles.root}>
        <Card>
          <CardActions>
            <FlatButton
              label='GO TO LINE'
              labelStyle={styles.tertiary}
              fullWidth={true}
              href='https://line.me/R/ti/p/%40ond8714j'
            />
            <br />
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
              label='CHAT'
              fullWidth={true}
              onTouchTap={() => location.href='#chat'}
            />
            <br />
            <FlatButton
              label='MESSAGE'
              fullWidth={true}
              style={styles.quaternary}
              onTouchTap={() => location.href='#message'}
            />
          </CardActions>
        </Card>
      </div>
    )
  }
}
