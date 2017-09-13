import React, { Component } from 'react'
import firebase from 'firebase'

import {
  TextField,
  RaisedButton,
} from 'material-ui'

const styles = {
  root: {
    padding: '10px',
    width: '100%',
  },
}

export default class Main extends Component {
  render() {
    return (
      <div style={styles.root}>
        <div>Main</div>
      </div>
    )
  }
}
