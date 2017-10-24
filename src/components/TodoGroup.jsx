import React, { Component } from 'react'
import firebase from 'firebase'
import moment from 'moment'

import {
  TextField,
  FlatButton,
  RaisedButton,
  Dialog,
  Card,
  CardHeader,
  CardText,
  CardActions,
  SelectField,
  MenuItem,
} from 'material-ui'

const styles = {
  root: {
    padding: '65px 1vw 65px',
    width: '98vw',
  },
}

export default class TodoGroup extends Component {
  state = {
    auth: firebase.auth().currentUser,
    group: '',
    groups: [],
    color: '',
    title: '',
    text: '',
    groupFlag: false,
    addFlag: false,
    editFlag: false,
    deleteFlag: false,
    sortFlag: true,
  }

  /**
   * グループの追加
   */
  addGroup = () => {
    const { group, color, groupFlag } = this.state
    const groupObj = {
      group: group,
      color: color,
      enter_datetime: firebase.database.ServerValue.TIMESTAMP,
    }
    this.groupsRef.push(groupObj).then(() => {
      this.clearGroupForm()
    }, err => {
      console.log(err)
    })
    this.setState({
      groupFlag: !groupFlag,
    })
  }

  /**
   * グループフォームの初期化
   */
  clearGroupForm = () => {
    this.setState({
      group: '未選択',
      color: '',
    })
  }

  /**
   * グループの新規作成フォーム
   */
  GroupForm = () => {
    const { group, color, groupFlag } = this.state
    const disabled = group === ''
    return (
      <div>
        <CardText>
        <TextField
          hintText='group'
          floatingLabelText='group'
          fullWidth={true}
          value={group}
          onChange={e => {
            const value = e.target.value
            this.setState({
              group: value,
            })
          }}
        />
        <br />
        <TextField
          hintText='color'
          floatingLabelText='color'
          fullWidth={true}
          value={color}
          onChange={e => {
            const value = e.target.value
            this.setState({
              color: value,
            })
          }}
        />
        </CardText>
        <CardActions>
          <div style={styles.center}>
            <div>
              <RaisedButton
                label='RETURN'
                secondary={true}
                style={styles.button}
                onTouchTap={() => this.setState({ groupFlag: !groupFlag })}
              />
              <span> </span>
              <RaisedButton
                label='ADD'
                primary={true}
                disabled={disabled}
                style={styles.button}
                onTouchTap={() => this.addGroup()}
              />
            </div>
          </div>
        </CardActions>
      </div>
    )
  }

  render() {
    return (
      <div style={styles.root}>TodoGroup</div>
    )
  }
}
