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
  Snackbar,
} from 'material-ui'

import Detail from './Detail'

const styles = {
  root: {
    padding: '65px 1vw 65px',
    width: '98vw',
  },
  text: {
    textAlign: 'center',
  },
  card: {
    padding: '1vh 1vw',
  },
  snackbar: {
    height: '60px',
  },
  total: {
    fontWeight: 900,
    fontSize: 'large',
  },
}

export default class Home extends Component {
  state = {
    auth: firebase.auth().currentUser,
    useArray: [],
    detailFlag: false,
    inputFlag: null,
  }

  componentWillMount = () => {
    localStorage.setItem('hash', location.hash.slice(2))
  }

  componentDidMount = () => {
    const { auth } = this.state
    const state = JSON.parse(localStorage.getItem('state'))
    localStorage.removeItem('state')
    const date = new Date(state !== null ? 'date' in state ? state['date'] : moment() : moment())
    const message = state !== null ? 'message' in state ? state['message'] : '' : ''
    this.setState({
      date: date,
      message: message,
    })
    this.useRef = firebase.database().ref('use/' + auth.uid)
    this.useRef.on('value', use => {
      if (use.val() !== null) {
        this.setState({
          use: use,
          inputFlag: true,
        })
        this.changeAll(date, use)
      } else {
        this.setState({
          inputFlag: false,
        })
      }
    })
  }

  componentWillUnmount = () => {
    this.useRef.off('value')
  }

  /**
   * 更新があった時の処理
   */
  changeAll = (date, use) => {
    const _date = moment(date).format('YYYY-MM-DD')
    this.getUse(_date, use)
    this.getTotalMoneyByDate(_date, use)
    this.getTotalMoneyByMonth(_date, use)
  }

  /**
   * 使ったお金一覧の取得
   */
  getUse = (date, use) => {
    let [useVal, useArray] = [use.val(), []]
    Object.keys(useVal).forEach(snapshot => {
      if (date === useVal[snapshot].date) {
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
      if (date === snapshot.val().date) {
        totalMoneyByDate += parseInt(snapshot.val().money)
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
      if (moment(date).format('M') === moment(snapshot.val().date).format('M')) {
        totalMoneyByMonth += parseInt(snapshot.val().money)
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
    const { use } = this.state
    this.changeAll(date, use)
    this.setState({
      date: date,
    })
  }

  /**
   * セルのタッチによる処理
   */
  goToDetail = id => {
    const props = {
      changeDetailFlag: this.changeDetailFlag,
      id: id,
    }
    this.setState({
      props: props,
    })
    this.changeDetailFlag()
  }

  /**
   * ホームと詳細画面を行き来する処理
   */
  changeDetailFlag = () => {
    const { detailFlag } = this.state
    this.setState({
      detailFlag: !detailFlag,
    })
  }

  /**
   * 何月かを調べる処理
   */
  checkMonth = number => {
    let month = ''
    switch (parseInt(number)) {
      case 1:
        month = 'Jan.'
        break
      case 2:
        month = 'Feb.'
        break
      case 3:
        month = 'Mar.'
        break
      case 4:
        month = 'Apr.'
        break
      case 5:
        month = 'May.'
        break
      case 6:
        month = 'Jun.'
        break
      case 7:
        month = 'Jul.'
        break
      case 8:
        month = 'Aug.'
        break
      case 9:
        month = 'Sept.'
        break
      case 10:
        month = 'Oct.'
        break
      case 11:
        month = 'Nov.'
        break
      case 12:
        month = 'Dec.'
        break
      default:
        break
    }
    return month
  }

  render() {
    const {
      useArray,
      date,
      totalMoneyByMonth,
      totalMoneyByDate,
      detailFlag,
      props,
      inputFlag,
      message,
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
          {inputFlag !== null ?
            inputFlag ? <div>
              {!detailFlag ? <div>
                <CardText>
                  <DatePicker
                    hintText='import date'
                    floatingLabelText='import date'
                    autoOk={true}
                    fullWidth={true}
                    value={date}
                    onChange={(a, date) => this.changeDate(date)}
                  />
                  <div>
                    {todayMonth === setMonth ? 'this month' : this.checkMonth(moment(date).format('M'))} total: <span style={styles.total}>{totalMoneyByMonth}</span> yen/month
                  </div>
                  <div>
                    {todayDate === setDate ? 'today' : moment(date).format('D')}th total: <span style={styles.total}>{totalMoneyByDate}</span> yen/day
                  </div>
                </CardText>
                {totalMoneyByDate !== 0 ? <div style={styles.card}>
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
                            <TableRow
                              key={index}
                              onTouchTap={() => this.goToDetail(row.id)}
                            >
                              <TableRowColumn><span style={styles.text}>{row.target}</span></TableRowColumn>
                              <TableRowColumn><span style={styles.text}>{row.money + ' yen'}</span></TableRowColumn>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </Card></div> : <CardText>
                  {todayDate === setDate ? 'today' : moment(date).format('D')}th is no use money
                </CardText>}
              </div> : <Detail props={props} />}
            </div> : <CardText>Let's put a KAKEIBO</CardText>
            : null}
        </Card>
        {message !== undefined ?
          <Snackbar
            open={message !== ''}
            message={message}
            autoHideDuration={3000}
            bodyStyle={styles.snackbar}
            onRequestClose={() => this.setState({ message: '' })}
          /> : null}
      </div>
    )
  }
}
