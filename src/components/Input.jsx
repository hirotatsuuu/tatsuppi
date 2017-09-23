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
  Card,
  CardHeader,
  CardText,
  CardActions,
} from 'material-ui'

const styles = {
  root: {
    padding: '65px 1vw 1vh',
    width: '98vw',
  },
  money: {
    width: '70vw',
  },
  dialog: {
    width: '100vw',
  },
}

export default class Input extends Component {
  state = {
    auth: firebase.auth().currentUser,
    date: new Date(moment()),
    dialogFlag: false,
    target: '',
    targetError: '',
    money: '',
    moneyErrorMessage: '',
    selectTaxValue: 1,
    selectPayValue: 1,
    selectTypeValue: 1,
  }

  componentWillMount = () => {
    const { selectTaxValue, selectPayValue, selectTypeValue } = this.state
    this.setState({
      tax: this.getSelectTax(selectTaxValue),
      pay: this.getSelectPay(selectPayValue),
      type: this.getSelectType(selectTypeValue),
    })
  }

  /**
   * 使ったお金の情報を新規追加
   */
  addUse = () => {
    const { auth, target, money, date, tax, pay, type, } = this.state
    const moneyObj = {
      target: target,
      use_money: Math.round(money * tax),
      enter_date: moment(date).format('YYYY-MM-DD'),
      howto_pay: pay,
      use_type: type,
      enter_datetime: firebase.database.ServerValue.TIMESTAMP,
    }
    firebase.database().ref('use/' + auth.uid).push(moneyObj).then(() => {
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
      this.setState({
        money: value,
      })
    }
    return message
  }

  /**
   * 税の選択の処理
   */
  getSelectTax = selectTaxValue => {
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
  getSelectPay = selectPayValue => {
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

  /**
   * 使ったお金の種類の選択の処理
   */
  getSelectType = selectTypeValue => {
    let type = ''
    switch (selectTypeValue) {
      case 1:
        type = '交際費'
        break
      case 2:
        type = '生活費'
        break
      case 3:
        type = '食費'
        break
      case 4:
        type = '無駄遣い'
        break
      case 5:
        type = 'その他'
        break
      default:
        break
    }
    return type
  }

  /**
   * 文字数制限のチェック
   */
  checkCount = value => {
    let message = ''
    if (value.length > 20) {
      message = '20文字以内で入力して下さい'
    }
    return message
  }

  /**
   * HOME画面に遷移
   */
  goHome = () => {
    const { auth, date } = this.state
    firebase.database().ref('state/' + auth.uid).set({ date: moment(date).format(), }).then(() => {
      this.setState({
        dialogFlag: false
      })
      location.href = '#home'
    }, err => {
      console.log(err)
    })
  }

  render() {
    const inputActions = [
      <FlatButton
        label='OK'
        secondary={true}
        onTouchTap={() => this.goHome()}
      />
    ]

    const {
      dialogFlag,
      date,
      target,
      targetError,
      money,
      moneyErrorMessage,
      tax,
      selectTaxValue,
      selectPayValue,
      selectTypeValue,
    } = this.state

    const disabled = money === '' || targetError !== ''

    return (
      <div style={styles.root}>
        <Card>
          <CardHeader
            title='INPUT USE MONEY'
          />
          <CardText>
            <DatePicker
              hintText='select date'
              floatingLabelText='select date'
              autoOk={true}
              fullWidth={true}
              value={date}
              onChange={(a, date) => this.changeDate(date)}
            />
            <TextField
              hintText='target'
              floatingLabelText='target'
              fullWidth={true}
              value={target}
              errorText={targetError}
              onChange={e => {
                const value = e.target.value
                this.setState({
                  target: value,
                  targetError: this.checkCount(value),
                })
              }}
            />
            <br />
            <TextField
              hintText='money'
              floatingLabelText='money'
              type='tel'
              style={styles.money}
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
            <br />
            <SelectField
              hintText='tax'
              floatingLabelText='tax'
              fullWidth={true}
              value={selectTaxValue}
              onChange={(e, i, selectTaxValue) =>
                this.setState({
                  tax: this.getSelectTax(selectTaxValue),
                  selectTaxValue: selectTaxValue,
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
            <br />
            <SelectField
              hintText='how to pay'
              floatingLabelText='how to pay'
              fullWidth={true}
              value={selectPayValue}
              onChange={(e, i, selectPayValue) =>
                this.setState({
                  pay: this.getSelectPay(selectPayValue),
                  selectPayValue: selectPayValue,
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
            <SelectField
              hintText='type'
              floatingLabelText='type'
              fullWidth={true}
              value={selectTypeValue}
              onChange={(e, i, selectTypeValue) =>
                this.setState({
                  type: this.getSelectType(selectTypeValue),
                  selectTypeValue: selectTypeValue,
                })
              }
            >
              <MenuItem
                value={1}
                primaryText='交際費'
              />
              <MenuItem
                value={2}
                primaryText='生活費'
              />
              <MenuItem
                value={3}
                primaryText='食費'
              />
              <MenuItem
                value={4}
                primaryText='無駄遣い'
              />
              <MenuItem
                value={5}
                primaryText='その他'
              />
            </SelectField>
          </CardText>
          <CardActions>
            <RaisedButton
              label='ADD'
              disabled={disabled}
              fullWidth={true}
              onTouchTap={() => this.addUse()}
            />
          </CardActions>
        </Card>
        <Dialog
          actions={inputActions}
          modal={false}
          open={dialogFlag}
          contentStyle={styles.dialog}
        >
          You have enterd using {Math.round(money * tax)} yen
        </Dialog>
      </div>
    )
  }
}
