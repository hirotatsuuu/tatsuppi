import React, { Component } from 'react'
import firebase from 'firebase'
import moment from 'moment'

import {
  DatePicker,
  Dialog,
  FlatButton,
  IconButton,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui'
import DeleteIcon from 'material-ui/svg-icons/action/delete'

const styles = {
  root: {
    padding: '70px 10px 10px',
    width: '100%',
  },
}

export default class Home extends Component {
  state = {
    date: new Date(moment()),
    useArray: [],
    removeFlag: false,
  }

  componentDidMount = () => {
    this.useRef = firebase.database().ref('use/' + firebase.auth().currentUser.uid)
    this.useRef.on('value', snapshot => {
      const date = moment(this.state.date).format('YYYY-MM-DD')
      this.getUse(date, snapshot)
      this.getTotalMoneyByDate(date, snapshot)
      this.getTotalMoneyByMonth(date, snapshot)
      this.setState({
        use: snapshot,
      })
    })
  }

  componentWillUnmount = () => {
    this.useRef.off('value')
  }

  getUse = (date, use) => {
    let [useVal, useArray] = [use.val(), []]
    Object.keys(useVal).forEach(snapshot => {
      if (date === useVal[snapshot].enter_date) {
        let obj = useVal[snapshot]
        obj.id = snapshot
        useArray.push(obj)
      }
    })
    this.setState({
      useArray: useArray,
    })
  }

  getTotalMoneyByDate = (date, use) => {
    let totalMoneyByDate = 0
    use.forEach(snapshot => {
      if (date === snapshot.val().enter_date) {
        totalMoneyByDate += parseInt(snapshot.val().use_money)
      }
    })
    this.setState({
      totalMoneyByDate: totalMoneyByDate,
    })
  }

  getTotalMoneyByMonth = (date, use) => {
    let totalMoneyByMonth = 0
    use.forEach(snapshot => {
      if (moment(date).format('M') === moment(snapshot.val().enter_date).format('M')) {
        totalMoneyByMonth += parseInt(snapshot.val().use_money)
      }
    })
    this.setState({
      totalMoneyByMonth: totalMoneyByMonth,
    })
  }

  change = date => {
    this.setState({
      date: date,
    })
    this.getUse(moment(date).format('YYYY-MM-DD'), this.state.use)
    this.getTotalMoneyByDate(moment(date).format('YYYY-MM-DD'), this.state.use)
    this.getTotalMoneyByMonth(moment(date).format('YYYY-MM-DD'), this.state.use)
  }

  removeUse = () => {
    firebase.database().ref('use/' + firebase.auth().currentUser.uid + '/' + this.state.removeId).remove().then(() => {
      this.setState({
        removeFlag: false
      })
    }, err => {
      console.log(err)
    })
  }

  render() {
    const { useArray, date } = this.state
    const [todayMonth, setMonth] = [
      moment().format('YYYYMM'),
      moment(date).format('YYYYMM')
    ]
    const [todayDate, setDate] = [
      moment().format('YYYYMMDD'),
      moment(date).format('YYYYMMDD')
    ]
    const removeActions = [
      <FlatButton
        label='cancel'
        onTouchTap={() => this.setState({removeFlag: false})}
      />,
      <FlatButton
        label='OK'
        onTouchTap={() => this.removeUse()}
      />
    ]

    return (
      <div style={styles.root}>
        <div>
          {todayMonth === setMonth ? '今月' : moment(date).format('M月')}の合計金額: {this.state.totalMoneyByMonth}円 / 月
        </div>
        <DatePicker
          hintText='import date'
          autoOk={true}
          value={date}
          onChange={(a, date) => this.change(date)}
        />
        <div>
          {todayDate === setDate ? '本日' : moment(date).format('D日')}の合計金額: {this.state.totalMoneyByDate}円 / 日
        </div>
        <Table>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn>target</TableHeaderColumn>
              <TableHeaderColumn>money</TableHeaderColumn>
              <TableHeaderColumn>remove</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            showRowHover={true}
            displayRowCheckbox={false}
          >
            {useArray.map((row, index) => {
              return (
                <TableRow key={index}>
                  <TableRowColumn>{row.target}</TableRowColumn>
                  <TableRowColumn>{row.use_money + '円'}</TableRowColumn>
                  <TableRowColumn>
                    <IconButton
                      onTouchTap={() => this.setState({removeFlag: true, removeId: row.id})}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableRowColumn>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <Dialog
          title='remove'
          actions={removeActions}
          modal={true}
          open={this.state.removeFlag}
          onRequestClose={() => this.setState({removeFlag: false})}
        >
          Are you OK ?
        </Dialog>
      </div>
    )
  }
}
