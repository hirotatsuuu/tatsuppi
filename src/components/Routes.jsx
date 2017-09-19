import React, { Component } from 'react'
import { Route, Switch, Link } from 'react-router-dom'

import Home from './Home'
import Input from './Input'
import Todo from './Todo'
import ForgotPassword from './ForgotPassword'
import CreateAccount from './CreateAccount'
import UpdatePassword from './UpdatePassword'
import UpdateAccount from './UpdateAccount'

const styles = {
  root: {
    padding: '70px 10px 10px',
    width: '100%',
  }
}

const NoMatch = location => (
  <div style={styles.root}>
    <span>{location.pathname}というURLは見つかりません</span>
  </div>
)

export default class Routes extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { loginFlag } = this.props

    return (
      <div>
        {loginFlag ?
          <Switch>
            <Route path='/home' component={Home} />
            <Route path='/input' component={Input} />
            <Route path='/todo' component={Todo} />
            <Route path='/updatepassword' component={UpdatePassword} />
            <Route path='/updateaccount' component={UpdateAccount} />
            <Route render={() => (<Link to='#' />)} />
          </Switch> :
          <Switch>
            <Route path='/forgotpassword' component={ForgotPassword} />
            <Route path='/createaccount' component={CreateAccount} />
            <Route render={() => (<Link to='#' />)} />
          </Switch>}
      </div>
    )
  }
}
