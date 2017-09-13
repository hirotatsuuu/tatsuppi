import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import Home from './Home'
import ForgotPassword from './ForgotPassword'
import CreateAccount from './CreateAccount'
import ChangePassword from './ChangePassword'

const styles = {
  root: {
    padding: '70px 10px 10px',
    width: '100%',
  }
}

export default class Routes extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        {this.props.loginFlag ? 
          <Switch>
            <Route path='/home' component={Home} />
            <Route path='/forgotpassword' component={ForgotPassword} />
            <Route path='/createaccount' component={CreateAccount} />
            <Route path='/changepassword' component={ChangePassword} />
            <Route component={NoMatch}/>
          </Switch> : 
          <Switch>
            <Route path='/forgotpassword' component={ForgotPassword} />
            <Route path='/createaccount' component={CreateAccount} />
          </Switch>}
      </div>
    )
  }
}

const NoMatch = ({location}) => (
  <div style={styles.root}>
    <span>{location.pathname}というURLは見つかりません</span>
  </div>
)
