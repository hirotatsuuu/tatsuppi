import React, { Component } from 'react'
import firebase from 'firebase'

const styles = {
  root: {
    padding: '10px',
    width: '100%',
  },
}

export default class Home extends Component {
  render() {
    return (
      <div style={styles.root}>
        <div>Home</div>
      </div>
    )
  }
}
