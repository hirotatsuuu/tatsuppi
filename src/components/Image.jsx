import React, { Component } from 'react'
import firebase from 'firebase'
import moment from 'moment'

import {
  Card,
  CardText,
} from 'material-ui'

import tatsuppi_icon from'../images/tatsuppi_icon.png'

const styles = {
  root: {
    padding: '65px 1vw 65px',
    width: '98vw',
  },
  image: {
    paddingLeft: '3vw',
    width: '80vw',
  },
}

export default class Image extends Component {
  componentWillMount = () => {
    localStorage.setItem('hash', location.hash.slice(2))
  }

  render() {
    return (
      <div style={styles.root}>
        <Card>
          <CardText>
            <img ref='image' src={tatsuppi_icon} style={styles.image} />
          </CardText>
        </Card>
      </div>
    )
  }
}
