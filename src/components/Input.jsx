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
  CardText,
  CardActions,
} from 'material-ui'

const styles = {
  root: {
    padding: '65px 1vw 65px',
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
    localStorage.setItem('hash', location.hash.slice(2))
    const { selectTaxValue, selectPayValue, selectTypeValue } = this.state
    this.setState({
      tax: this.getSelectTax(selectTaxValue),
      pay: this.getSelectPay(selectPayValue),
      type: this.getSelectType(selectTypeValue),
    })
  }

  /**
   * インプット情報のオブジェクト作成
   */
  makeInputObject = () => {
    const { date, money, target, tax, pay, type, } = this.state
    const input = {
      date: moment(date).format('YYYY-MM-DD'),
      money: Math.round((pay === 'bitcoin' ? money * 800000 :  money * tax)),
      target: target,
      pay: pay,
      type: type,
      enter_datetime: firebase.database.ServerValue.TIMESTAMP,
    }
    return input
  }

  /**
   * 使ったお金の情報を新規追加
   */
  addUse = () => {
    const { auth } = this.state
    const input = this.makeInputObject()
    firebase.database().ref('use/' + auth.uid).push(input).then(() => {
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
        pay = 'credit card'
        break
      case 2:
        pay = 'cash'
        break
      case 3:
        pay = 'Suica'
        break
      case 4:
        pay = 'bitcoin'
        break
      case 5:
        pay = 'auto'
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
        type = '無駄遣い'
        break
      case 2:
        type = '食費'
        break
      case 3:
        type = '交際費'
        break
      case 4:
        type = '電車代'
        break
      case 5:
        type = '必要経費'
        break
      case 6:
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
    const state = {
      date: moment(date).format(),
      message: 'ADD INPUT',
    }
    localStorage.setItem('state', JSON.stringify(state))
    this.setState({
      dialogFlag: false,
    })
    location.href = '#home'
  }

  DateForm = () => {
    const { date } = this.state
    return (
      <div>
        <DatePicker
          hintText='select date'
          floatingLabelText='select date'
          autoOk={true}
          fullWidth={true}
          value={date}
          onChange={(a, date) => this.changeDate(date)}
        />
      </div>
    )
  }

  MoneyForm = () => {
    const { money, moneyErrorMessage, tax, pay } = this.state
    return (
      <div>
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
        {moneyErrorMessage === '' ? <span>{pay === 'bitcoin' ? <span> BTC</span> : <span>{tax !== 1 ? '*' + tax : null} yen</span>}</span> : null}
      </div>
    )
  }

  TargetForm = () => {
    const { target, targetError } = this.state
    return (
      <div>
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
      </div>
    )
  }

  TaxForm = () => {
    const { selectTaxValue } = this.state
    return (
      <div>
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
            primaryText='YES'
          />
          <MenuItem
            value={2}
            primaryText='NO'
          />
        </SelectField>
      </div>
    )
  }

  PayForm = () => {
    const { selectPayValue } = this.state
    return (
      <div>
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
            primaryText='CREDIT CARD'
          />
          <MenuItem
            value={2}
            primaryText='CASH'
          />
          <MenuItem
            value={3}
            primaryText='SUICA'
          />
          <MenuItem
            value={4}
            primaryText='BITCOIN'
          />
          <MenuItem
            value={5}
            primaryText='DIRECT DEBIT'
          />
        </SelectField>
      </div>
    )
  }

  TypeForm = () => {
    const { selectTypeValue } = this.state
    return (
      <div>
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
            primaryText='無駄遣い'
          />
          <MenuItem
            value={2}
            primaryText='食費'
          />
          <MenuItem
            value={3}
            primaryText='交際費'
          />
          <MenuItem
            value={4}
            primaryText='電車代'
          />
          <MenuItem
            value={5}
            primaryText='必要経費'
          />
          <MenuItem
            value={6}
            primaryText='その他'
          />
        </SelectField>
      </div>
    )
  }

  DialogForm = () => {
    const inputActions = [
      <FlatButton
        label='OK'
        secondary={true}
        onTouchTap={() => this.goHome()}
      />
    ]
    const { dialogFlag, money, tax, pay } = this.state
    return (
      <Dialog
        actions={inputActions}
        open={dialogFlag}
        contentStyle={styles.dialog}
      >
        You have enterd using {Math.round(pay === 'bitcoin' ? money * 800000 :  money * tax)} yen
      </Dialog>
    )
  }

  AddButton = () => {
    const { money, targetError } = this.state
    const disabled = money === '' || targetError !== ''
    return (
      <RaisedButton
        label='ADD'
        disabled={disabled}
        primary={true}
        fullWidth={true}
        onTouchTap={() => this.addUse()}
      />
    )
  }

  render() {
    return (
      <div style={styles.root}>
        <Card>
          <CardText>
            <this.DateForm />
            <this.MoneyForm />
            <this.TargetForm />
            <this.TaxForm />
            <this.PayForm />
            <this.TypeForm />
          </CardText>
          <CardActions>
            <this.AddButton />
          </CardActions>
        </Card>
        <this.DialogForm />
      </div>
    )
  }
}
