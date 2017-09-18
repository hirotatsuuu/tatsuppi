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
  CardTitle,
  CardText,
  CardActions,
} from 'material-ui'

const styles = {
  root: {
    padding: '65px 1vw 1vh',
    width: '98vw',
  },
  error: {
    color: 'red',
  },
  cord: {
    padding: '1vh 1vw',
    width: '96vw',
  },
}

export default class Todo extends Component {
  state = {
    title: '',
    text: '',
    addFlag: false,
    editFlag: false,
    deleteFlag: false,
  }

  componentWillMount = () => {
    this.setState({
      authUid: firebase.auth().currentUser.uid,
    })
  }

  componentDidMount = () => {
    const { authUid } = this.state
    this.todosRef = firebase.database().ref('todos/' + authUid)
    this.todosRef.on('value', snapshots => {
      this.getTodos(snapshots.val())
    })
  }

  componentWillUnmount = () => {
    this.todosRef.off('value')
  }

  getTodos = todos => {
    if (todos) {
      let todosArray = []
      Object.keys(todos).forEach(snapshot => {
        let todo = todos[snapshot]
        todo.id = snapshot
        todosArray.push(todo)
      })
      this.setState({
        todosArray: todosArray,
      })
    }
  }

  addTodo = () => {
    const { title, text } = this.state
    const dateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const todoObj = {
      title: title,
      date_time: dateTime,
      text: text,
      enter_datetime: firebase.database.ServerValue.TIMESTAMP,
    }
    this.todosRef.push(todoObj).then(() => {
      // Todo
    }, err => {
      console.log(err)
    })
    this.setState({
      addFlag: false,
    })
  }

  editTodo = () => {
    const { title, text, authUid, editId } = this.state
    const dateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const editObj = {
      title: title,
      date_time: dateTime,
      text: text,
    }
    firebase.database().ref('todos/' + authUid + '/' + editId).update(editObj).then(() => {
      // Todo
    }, err => {
      console.log(err)
    })
    this.setState({
      editFlag: false,
    })
  }

  deleteTodo = () => {
    const { authUid, deleteId } = this.state
    firebase.database().ref('todos/' + authUid + '/' + deleteId).remove().then(() => {
      // Todo
    }, error => console.log(error))
    this.setState({
      deleteFlag: false,
    })
  }

  TodoForm = () => {
    const { title, text } = this.state
    return (
      <div>
        <TextField
          hintText='title'
          floatingLabelText='title'
          value={title}
          onChange={e => {
            const value = e.target.value
            this.setState({
              title: value,
            })
          }}
        />
        <br />
        <TextField
          hintText='text'
          floatingLabelText='text'
          value={text}
          onChange={e => {
            const value = e.target.value
            this.setState({
              text: value,
            })
          }}
        />
      </div>
    )
  }

  render() {
    const {
      todosArray,
      addFlag,
      editFlag,
      deleteFlag,
    } = this.state

    const addActions = [
      <FlatButton
        label='cancel'
        onTouchTap={() => this.setState({ addFlag: false, })}
      />,
      <FlatButton
        label='OK'
        onTouchTap={() => this.addTodo()}
      />
    ]

    const editActions = [
      <FlatButton
        label='cancel'
        onTouchTap={() => this.setState({ editFlag: false, })}
      />,
      <FlatButton
        label='OK'
        onTouchTap={() => this.editTodo()}
      />
    ]
    
    const deleteActions = [
      <FlatButton
        label='cancel'
        onTouchTap={() => this.setState({ deleteFlag: false, })}
      />,
      <FlatButton
        label='OK'
        onTouchTap={() => this.deleteTodo()}
      />
    ]

    return (
      <div style={styles.root}>
        <RaisedButton
          label='新規追加'
          onTouchTap={() => this.setState({addFlag: true,})}
        />
        {todosArray !== undefined ? todosArray.map((row, index) => {
          return (
            <div key={index} style={styles.cord}>
              <Card>
                <CardHeader
                  title={row.title}
                  subtitle={row.date_time}
                  actAsExpander={true}
                  showExpandableButton={true}
                />
                  <CardText expandable={true}>
                    {row.text}
                </CardText>
                <CardActions expandable={true}>
                  <FlatButton
                    label='編集'
                    onTouchTap={() => {
                      this.setState({
                        editFlag: true,
                        editId: row.id,
                        title: row.title,
                        text: row.text,
                      })
                    }}
                  />
                  <FlatButton
                    label='削除'
                    onTouchTap={() => {
                      this.setState({
                        deleteFlag: true,
                        deleteId: row.id,
                      })
                    }}
                  />
                </CardActions>
              </Card>
            </div>
          )
        }) : null}
        <Dialog
          title='add'
          actions={addActions}
          modal={true}
          open={addFlag}
          onRequestClose={() => this.setState({addFlag: false,})}
        >
          <this.TodoForm />
        </Dialog>
        <Dialog
          title='edit'
          actions={editActions}
          modal={true}
          open={editFlag}
          onRequestClose={() => this.setState({editFlag: false,})}
        >
          <this.TodoForm />
        </Dialog>
        <Dialog
          title='delete'
          actions={deleteActions}
          modal={true}
          open={deleteFlag}
          onRequestClose={() => this.setState({deleteFlag: false,})}
        >
          削除してよろしいですか？
        </Dialog>
      </div>
    )
  }
}
