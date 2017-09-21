import React, { Component } from 'react'
import firebase from 'firebase'

import {
  AppBar,
  MenuItem,
  Drawer,
  Dialog,
  FlatButton,
} from 'material-ui'

const styles = {
  root: {
    position: 'fixed',
    height: '60px',
    width: '100vw',
    backgroundColor: 'pink',
  },
  dialog: {
    width: '100vw',
  },
}

export default class Main extends Component {
  state = {
    loginUserName: '',
    menuFlag: false,
    logoutDialogFlag: false,
  }

  constructor(props) {
    super(props)
  }

  componentWillMount = () => {
    this.setState({
      auth: firebase.auth().currentUser,
    })
  }

  componentDidMount = () => {
    const { auth } = this.state
    this.userRef = firebase.database().ref('users/' + auth.uid)
    this.userRef.once('value', snapshot => {
      this.setState({
        loginUserName: snapshot.val().name,
      })
    })
    this.userRef.on('child_changed', data => {
      this.getAccountName(data)
    })
  }

  componentWillUnmount = () => {
    this.userRef.off('value')
  }

  /**
   * ログイン中のアカウントの名前の取得
   */
  getAccountName = data => {
    data.key === 'name' ? this.setState({loginUserName: data.val()}) : null
  }

  /**
   * ログアウト処理
   */
  logout = () => {
    firebase.auth().signOut().then(() => {
      this.props.logoutAuth()
    }, err => {
      console.log(err)
    })
    this.setState({
      menuFlag: false,
      logoutDialogFlag: false,
    })
  }

  /**
   * ヘッダーのタイトル変更
   */
  changeTitle = () => {
    let title = ''
    switch (location.hash.slice(2)) {
      case 'home':
        title = 'HOME'
        break
      case 'input':
        title = 'INPUT'
        break
      case 'todo':
        title = 'TODO'
        break
      case 'updatepassword':
        title = 'PASSWORD'
        break
      case 'updateaccount':
        title = 'ACCOUNT'
        break
      default:
        title = 'default'
        break
    }
    if (title !== 'default') {
      this.setState({
        title: title,
      })
    }
  }

  render() {
    const logoutActions = [
      <FlatButton
        label='CANCEL'
        secondary={true}
        onTouchTap={() => this.setState({logoutDialogFlag: false,})}
      />,
      <FlatButton
        label='OK'
        primary={true}
        onTouchTap={() => this.logout()}
      />
    ]

    const {
      title,
      menuFlag,
      logoutDialogFlag,
      loginUserName,
    } = this.state

    return (
      <div>
        {window.onhashchange=this.changeTitle}
        <AppBar
          style={styles.root}
          title={title}
          iconClassNameRight='muidocs-icon-navigation-expand-more'
          iconElementRight={
            <FlatButton
              label={loginUserName}
              onTouchTap={() => location.href = location.hash.slice(2) === 'updateaccount' ? '#home' : '#updateaccount'}
            />}
          onLeftIconButtonTouchTap={() => {
            this.setState({
              menuFlag: !menuFlag,
            })
          }}
        />
        <Drawer
          docked={false}
          width={200}
          open={menuFlag}
          onRequestChange={() => {
            this.setState({
              menuFlag: !menuFlag,
            })
          }}
        >
          <MenuItem
            onTouchTap={() => (this.setState({menuFlag: false}), location.href='#home')}
          >HOME</MenuItem>
          <MenuItem
            onTouchTap={() => (this.setState({menuFlag: false}), location.href='#input')}
          >INPUT</MenuItem>
          <MenuItem
            onTouchTap={() => {
              this.setState({
                menuFlag: false,
              }),
              location.href = '#todo'
            }}
          >TODO</MenuItem>
          <MenuItem
            onTouchTap={() => (this.setState({menuFlag: false}), location.href='#updatepassword')}
          >PASSWORD</MenuItem>
          <MenuItem
            onTouchTap={() => this.setState({logoutDialogFlag: true})}
          >LOGOUT</MenuItem>
        </Drawer>
        <Dialog
          title='LOGOUT'
          modal={false}
          open={logoutDialogFlag}
          actions={logoutActions}
          contentStyle={styles.dialog}
        >Are you sure you want to logout ?
        </Dialog>
      </div>
    )
  }
}
