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
  Card,
  CardText,
} from 'material-ui'

import Detail from './Detail'

const styles = {
  root: {
    padding: '65px 1vw 1vh',
    width: '98vw',
  },
  text: {
    textAlign: 'center',
  },
  card: {
    padding: '1vh 1vw',
  },
}

export default class Home extends Component {
  state = {
    date: new Date(moment()),
    useArray: [],
    detailFlag: false,
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

  /**
   * 使ったお金一覧の取得
   */
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

  /**
   * 一日の使ったお金の合計の取得
   */
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

  /**
   * 一月の使ったお金の合計の取得
   */
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

  /**
   * 日付を変更したときの処理
   */
  changeDate = date => {
    this.setState({
      date: date,
    })
    const _date = moment(date).format('YYYY-MM-DD')
    const { use } = this.state
    this.getUse(_date, use)
    this.getTotalMoneyByDate(_date, use)
    this.getTotalMoneyByMonth(_date, use)
  }

  /**
   * セルのタッチによる処理
   */
  cellTouch = id => {
    const { detaiFlag } = this.state
    const props = {
      changeDetailFlag: this.changeDetailFlag,
      id: id,
    }
    this.setState({
      detaiFlag: !detaiFlag,
      props: props,
    })
  }

  /**
   * コンポーネントを切り替える処理
   */
  changeDetailFlag = () => {
    const { detaiFlag } = this.state
    this.setState({
      detaiFlag: !detaiFlag,
    })
  }

  render() {
    const {
      useArray,
      date,
      totalMoneyByMonth,
      totalMoneyByDate,
      detaiFlag,
      props,
    } = this.state

    const [todayMonth, setMonth] = [
      moment().format('YYYYMM'),
      moment(date).format('YYYYMM')
    ]

    const [todayDate, setDate] = [
      moment().format('YYYYMMDD'),
      moment(date).format('YYYYMMDD')
    ]

    return (
      <div style={styles.root}>
        <Card>
          {!detaiFlag ? <div>
            <CardText>
              <DatePicker
                hintText='import date'
                floatingLabelText='import date'
                autoOk={true}
                value={date}
                onChange={(a, date) => this.changeDate(date)}
              />
              <div>
                {todayMonth === setMonth ? '今月' : moment(date).format('M月')}の合計金額: {totalMoneyByMonth}円 / 月
              </div>
              <div>
                {todayDate === setDate ? '本日' : moment(date).format('D日')}の合計金額: {totalMoneyByDate}円 / 日
              </div>
            </CardText>  
            {totalMoneyByDate === 0 ? <span><br />{todayDate === setDate ? '本日' : moment(date).format('D日')}はまだお金を使っていません
            </span> : <div style={styles.card}>
              <Card>
                <Table>
                  <TableHeader
                    displaySelectAll={false}
                    adjustForCheckbox={false}
                  >
                    <TableRow>
                      <TableHeaderColumn><span style={styles.text}>target</span></TableHeaderColumn>
                      <TableHeaderColumn><span style={styles.text}>money</span></TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody
                    showRowHover={true}
                    displayRowCheckbox={false}
                  >
                    {useArray.map((row, index) => {
                      return (
                        <TableRow key={index}
                          onTouchTap={() => this.cellTouch(row.id)}
                        >
                          <TableRowColumn><span style={styles.text}>{row.target}</span></TableRowColumn>
                          <TableRowColumn><span style={styles.text}>{row.use_money + ' 円'}</span></TableRowColumn>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </Card></div>}
          </div> : <Detail props={props} />}
        </Card>
      </div>
    )
  }
}
