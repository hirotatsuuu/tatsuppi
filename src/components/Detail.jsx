import React, { Component } from 'react'
import firebase from 'firebase'

import {
  FlatButton,
  Card,
  CardHeader,
  CardText,
  CardActions,
  Dialog,
} from 'material-ui'

const styles = {
  card: {
    textAlign: 'center',
  },
  button: {
    width: '40vw',
  },
  dialog: {
    width: '100vw',
  },
}

export default class Detail extends Component {
  state = {
    deleteFlag: false,
  }

  constructor(props) {
    super(props)
  }

  componentWillMount = () => {
    this.setState({
      auth: firebase.auth().currentUser,
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
    })
  }

  componentWillUnmount = () => {
    this.useRef.off('value')
  }

  /**
   * 使ったお金の削除
   */
  deleteUse = () => {
    const { auth, deleteId } = this.state
    this.setState({
      deleteFlag: false,
    })
    this.props.props.changeDetailFlag()
    firebase.database().ref('use/' + auth.uid + '/' + deleteId).remove().then(() => {
      // Todo
    }, err => {
      console.log(err)
    })
  }

  /**
   * 戻るをタッチしたときの処理
   */
  return = () => {
    this.props.props.changeDetailFlag()
  }

  render() {
    const {
      use,
      id,
      deleteFlag,
    } = this.state

    const deleteActions = [
      <FlatButton
        label='cancel'
        secondary={true}
        onTouchTap={() => this.setState({deleteFlag: false})}
      />,
      <FlatButton
        label='OK'
        primary={true}
        onTouchTap={() => this.deleteUse()}
      />
    ]

    return (
      <div>
        {use !== undefined ? <span>
          <Card>
            <CardHeader
              title={use.target}
              subtitle={use.enter_date}
            />
            <CardText>
              you use money {use.use_money} yen<br />
              you use how to pay {use.howto_pay}<br />
              use type is {use.use_type}
            </CardText>
            <CardActions>
              <div style={styles.card}>
                <FlatButton
                  label='RETURN'
                  secondary={true}
                  style={styles.button}
                  onTouchTap={() => this.return()}
                />
                <FlatButton
                  label='DELETE'
                  primary={true}
                  style={styles.button}
                  onTouchTap={() => (
                    this.setState({
                      deleteFlag: true,
                      deleteId: id,
                    })
                  )}
                />
              </div>
            </CardActions>
          </Card>
        </span> : null}
        <Dialog
          title='DELETE'
          actions={deleteActions}
          modal={true}
          open={deleteFlag}
          contentStyle={styles.dialog}
          onRequestClose={() => this.setState({deleteFlag: false})}
        >
          Are you sure you want to delete ?
        </Dialog>
      </div>
    )
  }
}
