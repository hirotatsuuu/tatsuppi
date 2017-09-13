import React, { Component } from 'react'
import firebase from 'firebase'

const styles = {
  root: {
    padding: '70px 10px 10px',
    width: '100%',
  },
}

export default class Input extends Component {
  render() {
    return (
      <div style={styles.root}>
        <div>Input</div>
      </div>
    )
  }
}
