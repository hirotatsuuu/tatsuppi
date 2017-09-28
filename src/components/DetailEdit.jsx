import React, { Component } from 'react'
import firebase from 'firebase'

import {
  FlatButton,
  Card,
} from 'material-ui'

import colors from './colors'

const styles = {
  card: {
    textAlign: 'center',
  },
  button: {
    width: '40vw',
  },
  dialog: {
    width: '100vw',
  },
  tertiary: {
    color: colors.tertiaryColor,
  }
}

export default class DetailEdit extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
        {this.props.id}
      </div>
    )
  }
}
