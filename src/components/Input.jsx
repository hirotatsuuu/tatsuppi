import React, { Component } from 'react'
import firebase from 'firebase'
import moment from 'moment'

import {
  TextField,
  RaisedButton,
  Dialog,
  FlatButton,
  DatePicker,
} from 'material-ui'

const styles = {
  root: {
    padding: '70px 10px 10px',
    width: '100%',
  },
}

export default class Input extends Component {
  state = {
    target: '',
    useMoney: '',
    date: new Date(moment()),
    dialogFlag: false,
  }

  addUse = () => {
    const { target, useMoney, date } = this.state
    const useMoneyObj = {
      target: target,
      use_money: useMoney,
      enter_date: moment(date).format('YYYY-MM-DD'),
      enter_datetime: firebase.database.ServerValue.TIMESTAMP,
    }
    firebase.database().ref('use/' + firebase.auth().currentUser.uid).push(useMoneyObj).then(() => {
      this.setState({
        dialogFlag: true,
        target: '',
        useMoney: '',
      })
    })
  }

  change = date => {
    this.setState({
      date: date,
    })
  }

  render() {
    const { target, useMoney, date } = this.state
    const disabled = useMoney === ''

    return (
      <div style={styles.root}>
        <DatePicker
          hintText='select date'
          floatingLabelText='select date'
          autoOk={true}
          value={date}
          onChange={(a, date) => this.change(date)}
        />
        <TextField
          hintText='target'
          floatingLabelText='target'
          value={this.state.target}
          onChange={e => this.setState({target: e.target.value})}
        />
        <br />
        <TextField
          hintText='use money'
          floatingLabelText='use money'
          value={this.state.useMoney}
          onChange={e => this.setState({useMoney: e.target.value})}
        />
        <br />
        <RaisedButton
          label='ADD'
          disabled={disabled}
          onTouchTap={() => this.addUse()}
        />
        <Dialog
          actions={
            <FlatButton
              label='OK'
              onTouchTap={() => (this.setState({dialogFlag: false}), location.href='#home')}
            />
          }
          modal={false}
          open={this.state.dialogFlag}
        >使ったお金を入力しました
        </Dialog>
      </div>
    )
  }
}
