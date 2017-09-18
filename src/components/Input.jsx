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
} from 'material-ui'

const styles = {
  root: {
    padding: '65px 1vw 1vh',
    width: '98vw',
  },
}

export default class Input extends Component {
  state = {
    date: new Date(moment()),
    target: '',
    money: '',
    moneyErrorMessage: '',
    tax: 1,
    selectTaxValue: 1,
    pay: '',
    selectPayValue: 1,
    dialogFlag: false,
  }

  /**
   * 使ったお金の情報を新規追加
   */
  addUse = () => {
    const { target, money, date, tax, pay } = this.state
    const moneyObj = {
      target: target,
      use_money: money * tax,
      enter_date: moment(date).format('YYYY-MM-DD'),
      howto_pay: pay,
      enter_datetime: firebase.database.ServerValue.TIMESTAMP,
    }
    firebase.database().ref('use/' + firebase.auth().currentUser.uid).push(moneyObj).then(() => {
      this.setState({
        dialogFlag: true,
      })
    }, err => {
      console.log(err)
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
      const { tax } = this.state
      this.setState({
        money: value,
      })
    }
    return message
  }

  /**
   * 税の選択の処理
   */
  changeSelectTax = selectTaxValue => {
    this.setState({
      selectTaxValue: selectTaxValue,
    })
    let tax = 1
    switch (selectTaxValue) {
      case 1:
        tax = 1
        break
      case 2:
        tax = 1.08
        break
      default:
        break
    }
    return tax
  }

  /**
   * 支払い方法の選択の処理
   */
  changeSelectPay = selectPayValue => {
    this.setState({
      selectPayValue: selectPayValue,
    })
    let pay = ''
    switch (selectPayValue) {
      case 1:
        pay = 'クレジットカード'
        break
      case 2:
        pay = '現金'
        break
      default:
        break
    }
    return pay
  }

  render() {
    const {
      date,
      target,
      money,
      moneyErrorMessage,
      tax,
      selectTaxValue,
      selectPayValue,
      dialogFlag,
    } = this.state

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
        />
        {moneyErrorMessage === '' ? <span>{tax !== 1 ? '*' + tax : null} yen</span> : null}
        <br /><br />
        <SelectField
          value={selectTaxValue}
          onChange={(e, i, selectTaxValue) =>
            this.setState({
              tax: this.changeSelectTax(selectTaxValue),
            })
          }
        >
          <MenuItem
            value={1}
            primaryText='税込み'
          />
          <MenuItem
            value={2}
            primaryText='税抜き'
          />
        </SelectField>
        <br /><br />
        <SelectField
          value={selectPayValue}
          onChange={(e, i, selectPayValue) =>
            this.setState({
              pay: this.changeSelectPay(selectPayValue),
            })
          }
        >
          <MenuItem
            value={1}
            primaryText='クレジットカード'
          />
          <MenuItem
            value={2}
            primaryText='現金'
          />
        </SelectField>
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
          open={dialogFlag}
        >
          You have enterd using {money * tax} yen
        </Dialog>
      </div>
    )
  }
}
