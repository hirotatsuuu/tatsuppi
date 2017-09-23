import React, { Component } from 'react'
import firebase from 'firebase'
import moment from 'moment'

import {
  TextField,
  RaisedButton,
  Dialog,
  FlatButton,
  DatePicker,
  SelectField,
  MenuItem,
  Card,
  CardHeader,
  CardText,
  CardActions,
} from 'material-ui'

const styles = {
  root: {
    padding: '65px 1vw 1vh',
    width: '98vw',
  },
  dialog: {
    width: '100vw',
  },
}

export default class CHAT extends Component {
  render() {
    return (
      <div style={styles.root}>
        <Card>
          <CardHeader
            title='CHAT'
          />
          <CardActions>
            <FlatButton
              label='CHAT'
            />
          </CardActions>
        </Card>
      </div>
    )
  }
}
