import React, { Component } from 'react'
import firebase from 'firebase'
import moment from 'moment'

import {
  RaisedButton,
  FlatButton,
  Card,
  CardActions,
  Paper,
  BottomNavigation,
  BottomNavigationItem
} from 'material-ui'

import Home from 'material-ui/svg-icons/action/home'
import Add from 'material-ui/svg-icons/content/add'
import Todo from 'material-ui/svg-icons/action/dns'
import Chat from 'material-ui/svg-icons/social/people'
import Settings from 'material-ui/svg-icons/action/settings'

const home = <Home />
const add = <Add />
const todo = <Todo />
const chat = <Chat />
const settings = <Settings />

const styles = {
  root: {
    padding: '65px 1vw 0',
    width: '98vw',
  },
  center: {
    textAlign: 'center',
  },
  button: {
    width: '40vw',
  },
  card: {
    paddingBottom: '1vh',
  },
  full: {
    width: '100vw',
  },
  bottom: {
    position: 'fixed',
    bottom: '-5px',
    width: '100vw',
    height: '60px',
  },
}

export default class CHAT extends Component {
  render() {
    return (
      <div>
        <div style={styles.root}>
          <div style={styles.card}>
            <Card>
              <CardActions>
                <div style={styles.center}>
                  <FlatButton
                    label='TEMP'
                    secondary={true}
                    style={styles.button}
                    onTouchTap={() => this.return()}
                  />
                  <RaisedButton
                    label='MATCH'
                    style={styles.button}
                    onTouchTap={() => location.href='#match'}
                  />
                </div>
              </CardActions>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}
