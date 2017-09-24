import React, { Component } from 'react'
import firebase from 'firebase'
import moment from 'moment'

import {
  RaisedButton,
  FlatButton,
  Card,
  CardActions,
} from 'material-ui'

const styles = {
  root: {
    padding: '65px 1vw 1vh',
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
}

export default class CHAT extends Component {

  return = () => {

  }

  render() {
    return (
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
    )
  }
}
