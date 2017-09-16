import React, { Component } from 'react'
import firebase from 'firebase'
import moment from 'moment'

import {
  DatePicker,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui'

const styles = {
  root: {
    padding: '70px 10px 10px',
    width: '100%',
  },
}

export default class Month extends Component {
  state = {
    date: new Date(moment()),
    useArray: [],
  }

  componentDidMount = () => {
    this.useRef = firebase.database().ref('use/' + firebase.auth().currentUser.uid)
    this.useRef.on('value', snapshot => {
      this.setState({
        use: snapshot
      })
      this.getUse(moment().format('YYYY-MM-DD'), snapshot)
      this.getTotalMoney(moment().format('YYYY-MM-DD'), snapshot)
    })
  }

  componentWillUnmount = () => {
    this.useRef.off('value')
  }

  getUse = (date, use) => {
    let useArray = []
    use.forEach(snapshot => {
      if (date === snapshot.val().enter_date) {
        useArray.push(snapshot.val())
      }
    })
    this.setState({
      useArray: useArray,
    })
  }

  getTotalMoney = (date, use) => {
    let totalMoney = 0
    use.forEach(snapshot => {
      if (date === snapshot.val().enter_date) {
        totalMoney += parseInt(snapshot.val().use_money)
      }
    })
    this.setState({
      totalMoney: totalMoney,
    })
  }

  change = date => {
    console.log(date)
    this.setState({
      date: date,
    })
    this.getUse(moment(date).format('YYYY-MM-DD'), this.state.use)
    this.getTotalMoney(moment(date).format('YYYY-MM-DD'), this.state.use)
  }

  render() {
    return (
      <div style={styles.root}>
        <DatePicker
          hintText='import date'
          value={this.state.date}
          onChange={(a, date) => this.change(date)}
        />
        <div>
          合計金額: {this.state.totalMoney}円
        </div>
        <Table>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn>target</TableHeaderColumn>
              <TableHeaderColumn>money</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            showRowHover={true}
            displayRowCheckbox={false}
          >
            {this.state.useArray.length !== 0 ? this.state.useArray.map((row, index) => {
              return (
                <TableRow key={index}>
                  <TableRowColumn>{row.target}</TableRowColumn>
                  <TableRowColumn>{row.use_money + '円'}</TableRowColumn>
                </TableRow>
              )
            }) : null}
          </TableBody>
        </Table>
      </div>
    )
  }
}
