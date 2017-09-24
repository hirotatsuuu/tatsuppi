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
  center: {
    textAlign: 'center',
  },
  button: {
    width: '40vw',
  },
  card: {
    paddingBottom: '1vh',
  },
  full: {
    width: '100vw',
  },
}

export default class CHAT extends Component {
  state = {
    auth: firebase.auth().currentUser,
    create: '',
    search: '',
    searchDialogFlag: false,
    createDialogFlag: false,
  }

  componentDidMount = () => {
    this.idRef = firebase.database().ref('state/id')
    let idArray = []
    this.idRef.on('value', id => {
      this.setState({
        stateId: id,
      })
    })
  }

  componentWillUnmount = () => {
    this.idRef.off('value')
  }

  /**
   * ID一致チェック
   */
  idCheck = id => {
    const { stateId } = this.state
    let flag = true
    stateId.forEach(snapshot => {
      if (snapshot.val().id === id) {
        flag = false
      }
    })
    return flag
  }

  /**
   * 一致したIDのkeyを取得
   */
  getKey = id => {
    const { stateId } = this.state
    let key = ''
    stateId.forEach(snapshot => {
      if (snapshot.val().id === id) {
        key = snapshot.key
      }
    })
    return key
  }

  /**
   * 一致したIDのUIDを取得
   */
  getUID = id => {
    const { stateId } = this.state
    let uid = ''
    stateId.forEach(snapshot => {
      if (snapshot.val().id === id) {
        uid = snapshot.val().uid
      }
    })
    return uid
  }

  /**
   * 一致したIDのUIDのアカウント名を取得
   */
  getAccountName = uid => {
    let name = ''
    firebase.database().ref('users/' + uid).once('value', user => {
      name = user.val().name
    })
    return name
  }

  /**
   * IDの生成
   */
  createId = () => {
    const { auth, create } = this.state
    if (this.idCheck(create)) {
      const idObj = {
        id: create,
        uid: auth.uid,
      }
      this.idRef.push(idObj).then(() => {
        this.setState({
          createDialogFlag: true,
        })
      }, err => {
        console.log(err)
      })
    } else {
      this.setState({
        createError: '入力されたIDは使用できません',
      })
    }
  }

  /**
   * IDの探索
   */
  searchId = () => {
    const { search } = this.state
    if (!this.idCheck(search)) {
      this.setState({
        searchDialogFlag: true,
        key: this.getKey(search),
        name: this.getAccountName(this.getUID(search)),
      })
    } else {
      this.setState({
        searchError: 'アカウントが見つかりませんでした',
      })
    }
  }

  /**
   * 戻るの処理
   */
  return = () => {
    // Todo
  }

  /**
   * IDの作成に成功した時の処理
   */
  createSuccess = () => {
    this.setState({
      create: '',
      createError: '',
      createDialogFlag: false,
    })
  }

  /**
   * IDの探索に成功した時の処理
   */
  searchSuccess = () => {
    this.setState({
      search: '',
      searchError: '',
      searchDialogFlag: false,
    })
    const { key } = this.state
    firebase.database().ref('state/id/' + key).remove().then(() => {
      // Todo
    }, err => {
      console.log(err)
    })
  }

  render() {
    const createActions = [
      <FlatButton
        label='OK'
        onTouchTap={() => this.createSuccess()}
      />
    ]

    const searchActions = [
      <FlatButton
        label='CANCEL'
        onTouchTap={() => this.setState({searchDialogFlag: false})}
      />,
      <FlatButton
        label='OK'
        onTouchTap={() => this.searchSuccess()}
      />
    ]

    const {
      create,
      createError,
      createDialogFlag,
      search,
      searchError,
      searchDialogFlag,
      name,
    } = this.state

    const createDisabled = search !== ''
    const searchDisabled = create !== ''
    const createButtonDisabled = createDisabled || create === ''
    const searchButtonDisabled = searchDisabled || search === ''

    return (
      <div style={styles.root}>
        <div style={styles.card}>
          <Card>
            <CardHeader
              title='CREATE'
            />
            <CardText>
              <TextField
                hintText='create'
                floatingLabelText='create'
                fullWidth={true}
                disabled={createDisabled}
                value={create}
                errorText={createError}
                onChange={e => {
                  const value = e.target.value
                  this.setState({
                    create: value,
                  })
                }}
              />
            </CardText>
            <CardActions>
              <div style={styles.center}>
                <FlatButton
                  label='RETURN'
                  secondary={true}
                  disabled={createDisabled}
                  style={styles.button}
                  onTouchTap={() => this.return()}
                />
                <FlatButton
                  label='CREATE'
                  primary={true}
                  disabled={createButtonDisabled}
                  style={styles.button}
                  onTouchTap={() => this.createId()}
                />
              </div>
            </CardActions>
          </Card>
        </div>
        <div style={styles.card}>
          <Card>
            <CardHeader
              title='SEARCH'
            />
            <CardText>
              <TextField
                hintText='search'
                floatingLabelText='search'
                fullWidth={true}
                disabled={searchDisabled}
                value={search}
                errorText={searchError}
                onChange={e => {
                  const value = e.target.value
                  this.setState({
                    search: value,
                  })
                }}
              />
            </CardText>
            <CardActions>
              <div style={styles.center}>
                <FlatButton
                  label='RETURN'
                  secondary={true}
                  disabled={searchDisabled}
                  style={styles.button}
                  onTouchTap={() => this.return()}
                />
                <FlatButton
                  label='SEARCH'
                  primary={true}
                  disabled={searchButtonDisabled}
                  style={styles.button}
                  onTouchTap={() => this.searchId()}
                />
              </div>
            </CardActions>
          </Card>
          <Dialog
            title='CREATE'
            actions={createActions}
            modal={true}
            open={createDialogFlag}
            contentStyle={styles.full}
            onRequestClose={() => this.setState({createDialogFlag: false})}
          >
            IDを作成しました
          </Dialog>
          <Dialog
            title='SEARCH'
            actions={searchActions}
            modal={true}
            open={searchDialogFlag}
            contentStyle={styles.full}
            onRequestClose={() => this.setState({searchDialogFlag: false})}
          >
            {name}を追加しますか？
          </Dialog>
        </div>
      </div>
    )
  }
}
