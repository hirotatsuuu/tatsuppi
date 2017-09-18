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
    padding: '65px 1vw 1vh',
    width: '98vw',
  },
}

export default class Home extends Component {
  state = {
    date: new Date(moment()),
    useArray: [],
    deleteFlag: false,
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
   * 使ったお金の削除
   */
  deleteUse = () => {
    firebase.database().ref('use/' + firebase.auth().currentUser.uid + '/' + this.state.deleteId).remove().then(() => {
      this.setState({
        deleteFlag: false,
      })
    }, err => {
      console.log(err)
    })
  }

  render() {
    const {
      useArray,
      date,
      totalMoneyByMonth,
      totalMoneyByDate,
      deleteFlag,
    } = this.state

    const [todayMonth, setMonth] = [
      moment().format('YYYYMM'),
      moment(date).format('YYYYMM')
    ]

    const [todayDate, setDate] = [
      moment().format('YYYYMMDD'),
      moment(date).format('YYYYMMDD')
    ]

    const deleteActions = [
      <FlatButton
        label='cancel'
        onTouchTap={() => this.setState({deleteFlag: false})}
      />,
      <FlatButton
        label='OK'
        onTouchTap={() => this.deleteUse()}
      />
    ]

    return (
      <div style={styles.root}>
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
        {totalMoneyByDate === 0 ? <span><br />{todayDate === setDate ? '本日' : moment(date).format('D日')}はまだお金を使っていません</span> :
          <Table>
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}
            >
              <TableRow>
                <TableHeaderColumn>target</TableHeaderColumn>
                <TableHeaderColumn>money</TableHeaderColumn>
                <TableHeaderColumn>delete</TableHeaderColumn>
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
                        onTouchTap={() => this.setState({ deleteFlag: true, deleteId: row.id })}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableRowColumn>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>}
        <Dialog
          title='DELETE'
          actions={deleteActions}
          modal={true}
          open={deleteFlag}
          onRequestClose={() => this.setState({deleteFlag: false})}
        >
          Are you sure you want to delete ?
        </Dialog>
      </div>
    )
  }
}
