import React, { Component } from 'react'
import firebase from 'firebase'

import {
  AppBar,
  Menu,
  MenuItem,
  Drawer,
  Dialog,
  FlatButton,
  Divider,
  Paper,
  BottomNavigation,
  BottomNavigationItem,
} from 'material-ui'

import Home from 'material-ui/svg-icons/action/home'
import Add from 'material-ui/svg-icons/content/add'
import Dns from 'material-ui/svg-icons/action/dns'
import Settings from 'material-ui/svg-icons/action/settings'

const home = <Home />
const add = <Add />
const dns = <Dns />
const settings = <Settings />

const styles = {
  header: {
    position: 'fixed',
    height: '60px',
    width: '100vw',
  },
  full: {
    width: '100vw',
  },
  sub: {
    paddingLeft: '10px',
    color: 'gray',
  },
  footer: {
    position: 'fixed',
    bottom: '-5px',
    width: '100vw',
    height: '60px',
    zIndex: '2',
  },
}

export default class Main extends Component {
  state = {
    auth: firebase.auth().currentUser,
    loginUserName: '',
    menuFlag: false,
    logoutDialogFlag: false,
    selectedIndex: 0,
  }

  constructor(props) {
    super(props)
  }

  componentDidMount = () => {
    const { auth } = this.state
    this.userRef = firebase.database().ref('users/' + auth.uid)
    this.userRef.once('value', snapshot => {
      this.setState({
        loginUserName: snapshot.val().name,
      })
    })
    // アカウント名が変更されたときの処理
    this.userRef.on('child_changed', data => this.getAccountName(data))
  }

  componentWillUnmount = () => {
    this.userRef.off('value')
    this.userRef.off('child_changed')
  }

  /**
   * ログイン中のアカウントの名前の取得
   */
  getAccountName = data => data.key === 'name' ? this.setState({loginUserName: data.val()}) : null

  /**
   * ログアウト処理
   */
  logout = () => {
    const { auth } = this.state
    const changeState = this.setState({
      menuFlag: false,
      logoutDialogFlag: false,
    })
    Promise.all([changeState]).then(() => {
      firebase.auth().signOut().then(() => {
        this.props.logoutAuth()
      }, err => {
        console.log(err)
      })
    })
  }

  /**
   * ヘッダーのタイトル変更
   */
  changeTitle = hash => {
    let title = ''
    switch (hash) {
      case 'home':
        title = 'HOME'
        break
      case 'input':
        title = 'INPUT'
        break
      case 'todo':
        title = 'TODO'
        break
      case 'chat':
        title = 'CHAT'
        break
      case 'setting':
        title = 'SETTINGS'
        break
      case 'updatepassword':
        title = 'PASSWORD'
        break
      case 'updateaccount':
        title = 'ACCOUNT'
        break
      case 'match':
        title = 'MATCH'
        break
      case 'contact':
        title = 'CONTACT'
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

  /**
   * フッターメニューの処理
   */
  select = index => this.setState({ selectedIndex: index })

  /**
   * アカウントの状態によるフッタメニューの制御
   */
  changeSelect = hash => {
    switch (hash) {
      case 'home':
        this.select(0)
        break
      case 'input':
        this.select(1)
        break
      case 'todo':
        this.select(2)
        break
      case 'setting':
        this.select(3)
        break
      default:
        this.select(null)
        break
    }
  }

  /**
   * ハッシュが変更されたときの処理
   */
  changeHash = () => {
    const hash = location.hash.slice(2)
    this.changeTitle(hash)
    this.changeSelect(hash)
  }

  render() {
    const logoutActions = [
      <FlatButton
        label='CANCEL'
        secondary={true}
        onTouchTap={() => this.setState({logoutDialogFlag: false})}
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
      selectedIndex,
    } = this.state

    const menuFlagObj = {
      menuFlag: !menuFlag,
    }

    return (
      <div>
        {window.onhashchange=this.changeHash}
        <AppBar
          style={styles.header}
          title={title}
          iconElementRight={
            <FlatButton
              label={<span>{loginUserName}</span>}
              onTouchTap={() => this.setState({logoutDialogFlag: true})}
            />}
          onLeftIconButtonTouchTap={() => this.setState(menuFlagObj)}
        />
        <Drawer
          docked={false}
          width={200}
          open={menuFlag}
          onRequestChange={() => this.setState(menuFlagObj)}
        >
          <Menu
            autoWidth={false}
            width={200}
          >
            <span style={styles.sub}>Main</span>
            <MenuItem
              onTouchTap={() => (
                this.setState(menuFlagObj),
                location.href = '#home'
              )}
            >HOME</MenuItem>
            <MenuItem
              onTouchTap={() => (
                this.setState(menuFlagObj),
                location.href = '#input'
              )}
            >INPUT</MenuItem>
            <MenuItem
              onTouchTap={() => (
                this.setState(menuFlagObj),
                location.href = '#todo'
              )}
            >TODO</MenuItem>
            <Divider />
            <span style={styles.sub}>Settings</span>
            <MenuItem
              onTouchTap={() => (
                this.setState(menuFlagObj),
                location.href = 'https://line.me/R/ti/p/%40ond8714j'
              )}
            >LINE</MenuItem>
            <MenuItem
              onTouchTap={() => (
                this.setState(menuFlagObj),
                location.href = '#updateaccount'
              )}
            >ACCOUNT</MenuItem>
            <MenuItem
              onTouchTap={() => (
                this.setState(menuFlagObj),
                location.href = '#updatepassword'
              )}
            >PASSWORD</MenuItem>
            <MenuItem
              onTouchTap={() => (
                this.setState(menuFlagObj),
                location.href = '#contact'
              )}
            >CONTACT</MenuItem>
            <MenuItem
              onTouchTap={() => this.setState({logoutDialogFlag: true})}
            >LOGOUT</MenuItem>
          </Menu>
        </Drawer>
        <Paper zDepth={1} style={styles.footer}>
          <BottomNavigation
            selectedIndex={selectedIndex}
          >
            <BottomNavigationItem
              label='HOME'
              icon={home}
              onTouchTap={() => (
                this.select(0),
                location.href = '#home'
              )}
            />
            <BottomNavigationItem
              label='INPUT'
              icon={add}
              onTouchTap={() => (
                this.select(1),
                location.href = '#input'
              )}
            />
            <BottomNavigationItem
              label='TODO'
              icon={dns}
              onTouchTap={() => (
                this.select(2),
                location.href = '#todo'
              )}
            />
            <BottomNavigationItem
              label='SETTING'
              icon={settings}
              onTouchTap={() => (
                this.select(3),
                location.href = '#setting'
              )}
            />
          </BottomNavigation>
        </Paper>
        <Dialog
          title='LOGOUT'
          open={logoutDialogFlag}
          actions={logoutActions}
          contentStyle={styles.full}
        >
          Are you sure you want to logout ?
        </Dialog>
      </div>
    )
  }
}
