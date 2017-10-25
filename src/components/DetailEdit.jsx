import React, { Component } from 'react'
import firebase from 'firebase'
import moment from 'moment'

import {
  FlatButton,
  RaisedButton,
  DatePicker,
  TextField,
  Dialog,
  Card,
  CardHeader,
  CardText,
  CardActions,
} from 'material-ui'

const styles = {
  card: {
    textAlign: 'center',
  },
  button: {
    width: '40vw',
  },
  full: {
    width: '100vw',
  },
}

export default class DetailEdit extends Component {
  state = {
    auth: firebase.auth().currentUser,
    dialogFlag: false,
  }

  constructor (props) {
    super(props)
  }

  componentWillMount = () => {
    this.setState({
      id: this.props.props.id,
    })
  }

  componentDidMount = () => {
    const { auth, id } = this.state
    this.useRef = firebase.database().ref('use/' + auth.uid + '/' + id)
    this.useRef.on('value', snapshot => {
      this.setState({
        use: snapshot.val(),
      })
      this.setUse(snapshot.val())
    })
  }

  componentWillUnmount = () => {
    this.useRef.off('value')
  }

  /**
   * 初期値の設定
   */
  setUse = use => {
    this.setState({
      date: new Date(use.date),
      money: use.money,
      target: use.target,
      type: use.type,
      pay: use.pay,
    })
  }

  /**
   * 詳細画面に遷移する処理
   */
  changeEditFlag = () => {
    const { props } = this.props
    props.changeEditFlag()
  }

  /**
   * ホーム画面に遷移する処理
   */
  changeDetailFlag = () => {
    const { props } = this.props
    props.changeDetailFlag()
  }

  /**
   * 編集オブジェクトの作成
   */
  makeEditObj = () => {
    const { date, money, target, pay, type } = this.state
    const editObj = {
      date: moment(date).format('YYYY-MM-DD'),
      money: money,
      target: target,
      pay: pay,
      type: type,
    }
    return editObj
  }

  /**
   * 編集処理
   */
  editUse = () => {
    const { auth, id } = this.state
    const editObj = this.makeEditObj()
    firebase.database().ref('use/' + auth.uid + '/' + id).update(editObj).then(() => {
      this.changeDetailFlag()
    }, err => {
      console.log(err)
    })
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
    const {
      id,
      dialogFlag,
      date,
      money,
      target,
      pay,
      type,
      moneyError,
      targetError,
      typeError,
      payError,
    } = this.state

    const editActions = [
      <FlatButton
        label='cancel'
        secondary={true}
        onTouchTap={() => this.setState({dialogFlag: false})}
      />,
      <FlatButton
        label='OK'
        primary={true}
        onTouchTap={() => this.editUse()}
      />
    ]

    return (
      <div>
        <Card>
          <CardHeader
            title='Edit'
          />
          <CardText>
            <DatePicker
              hintText='date'
              floatingLabelText='date'
              autoOk={true}
              fullWidth={true}
              value={date}
              onChange={(a, date) => this.setState({ date: date, })}
            />
            <TextField
              hintText='money'
              floatingLabelText='money'
              type='tel'
              fullWidth={true}
              value={money}
              errorText={moneyError}
              onChange={e => {
                const value = e.target.value
                this.setState({
                  moneyError: this.checkNumber(value),
                })
              }}
            />
            <br />
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
              hintText='pay'
              floatingLabelText='pay'
              fullWidth={true}
              value={pay}
              errorText={payError}
              onChange={e => {
                const value = e.target.value
                this.setState({
                  pay: value,
                  payError: this.checkCount(value),
                })
              }}
            />
            <br />
            <TextField
              hintText='type'
              floatingLabelText='type'
              fullWidth={true}
              value={type}
              errorText={typeError}
              onChange={e => {
                const value = e.target.value
                this.setState({
                  type: value,
                  typeError: this.checkCount(value),
                })
              }}
            />
          </CardText>
          <CardActions>
            <div style={styles.card}>
              <RaisedButton
                label='RETURN'
                secondary={true}
                style={styles.button}
                onTouchTap={() => this.changeEditFlag()}
              />
              <span> </span>
              <RaisedButton
                label='ENTER'
                primary={true}
                style={styles.button}
                onTouchTap={() => this.setState({ dialogFlag: true, })}
              />
            </div>
          </CardActions>
        </Card>
        <Dialog
          title='EDIT'
          actions={editActions}
          open={dialogFlag}
          contentStyle={styles.full}
          onRequestClose={() => this.setState({dialogFlag: false})}
        >
          Are you sure you want to EDIT ?
        </Dialog>
      </div>
    )
  }
}
