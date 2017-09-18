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
    padding: '65px 1vw 1vh',
    width: '98vw',
  },
}

export default class Input extends Component {
  state = {
    target: '',
    money: '',
    moneyErrorMessage: '',
    date: new Date(moment()),
    dialogFlag: false,
  }

  /**
   * 使ったお金の情報を新規追加
   */
  addUse = () => {
    const { target, money, date } = this.state
    const moneyObj = {
      target: target,
      use_money: money,
      enter_date: moment(date).format('YYYY-MM-DD'),
      enter_datetime: firebase.database.ServerValue.TIMESTAMP,
    }
    firebase.database().ref('use/' + firebase.auth().currentUser.uid).push(moneyObj).then(() => {
      this.setState({
        dialogFlag: true,
        target: '',
        money: '',
      })
    })
  }

  /**
   * 日付を変更したときの処理
   */
  changeDate = date => {
    this.setState({
      date: date,
    })
  }

  /**
   * 数字チェック
   */
  checkNumber = value => {
    let message = ''
    if (value.match(/[^0-9]+/)) {
      message = '半角数字を入力して下さい'
    } else {
      this.setState({
        money: value,
      })
    }
    return message
  }

  render() {
    const { target, money, moneyErrorMessage, date } = this.state

    const disabled = money === ''

    return (
      <div style={styles.root}>
        <DatePicker
          hintText='select date'
          floatingLabelText='select date'
          autoOk={true}
          value={date}
          onChange={(a, date) => this.changeDate(date)}
        />
        <TextField
          hintText='target'
          floatingLabelText='target'
          value={target}
          onChange={e => {
            const value = e.target.value
            this.setState({target: value,})
          }}
        />
        <br />
        <TextField
          hintText='money'
          floatingLabelText='money'
          value={money}
          errorText={moneyErrorMessage}
          onChange={e => {
            const value = e.target.value
            this.setState({
              moneyErrorMessage: this.checkNumber(value),
            })
          }}
        />yen
        <br /><br />
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
        >
          You have enterd using the money
        </Dialog>
      </div>
    )
  }
}
