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
} from 'material-ui'

const styles = {
  root: {
    padding: '65px 1vw 1vh',
    width: '98vw',
  },
  error: {
    color: 'red',
  },
  card: {
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
    sortFlag: true,
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

  /**
   * Todoリストの取得
   */
  getTodos = todos => {
    let todosArray = []
    if (todos) {
      Object.keys(todos).forEach(snapshot => {
        let todo = todos[snapshot]
        todo.id = snapshot
        todosArray.push(todo)
      })
      const { sortFlag } = this.state
      todosArray = this.sortDateTime(todosArray, sortFlag)
    }
    this.setState({
      todosArray: todosArray,
    })
  }

  /**
   * 時間のソート処理
   */
  sortDateTime = (array, flag) => {
    let sortArray = []
    sortArray = array.sort((before, after) => {
      if (before.date_time < after.date_time) {
        return (flag ? 1 : -1)
      } else if (before.date_time > after.date_time) {
        return (flag ? -1 : 1)
      } else {
        return 0
      }
    })
    return sortArray
  }

  /**
   * Todoの追加
   */
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
      this.clearTodoForm()
    }, err => {
      console.log(err)
    })
    this.setState({
      addFlag: false,
    })
  }

  /**
   * Todoの編集
   */
  editTodo = () => {
    const { title, text, authUid, editId } = this.state
    const dateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const editObj = {
      title: title,
      date_time: dateTime,
      text: text,
    }
    firebase.database().ref('todos/' + authUid + '/' + editId).update(editObj).then(() => {
      this.clearTodoForm()
    }, err => {
      console.log(err)
    })
    this.setState({
      editFlag: false,
    })
  }

  /**
   * Todoの削除
   */
  deleteTodo = () => {
    const { authUid, deleteId } = this.state
    firebase.database().ref('todos/' + authUid + '/' + deleteId).remove().then(() => {
      // Todo
    }, err => {
      console.log(err)
    })
    this.setState({
      deleteFlag: false,
    })
  }

  /**
   * TodoFormのリセット
   */
  clearTodoForm = () => {
    this.setState({
      title: '',
      text: '',
    })
  }

  /**
   * Todoの入力フォーム
   */
  TodoForm = () => {
    const { title, text, addFlag, editFlag } = this.state

    return (
      <div>
        {addFlag ? <div>Add Todo</div> : editFlag ? <div>Edit Todo</div> : null}
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
          multiLine={true}
          rows={3}
          fullWidth={true}
          value={text}
          onChange={e => {
            const value = e.target.value
            this.setState({
              text: value,
            })
          }}
        />
        <br /><br />
        {addFlag ? <div>
          <FlatButton
            label='RETURN'
            secondary={true}
            onTouchTap={() => this.setState({ addFlag: false, })}
          />
          <span> </span>
          <RaisedButton
            label='OK'
            primary={true}
            onTouchTap={() => this.addTodo()}
          />
        </div> : editFlag ? <div>
          <FlatButton
            label='RETURN'
            secondary={true}
            onTouchTap={() => this.setState({ editFlag: false, })}
          />
          <span> </span>
          <RaisedButton
            label='OK'
            primary={true}
            onTouchTap={() => this.editTodo()}
          />
        </div> : null}
      </div>
    )
  }

  /**
   * ソートのボタン
   */
  SortButton = () => {
    const { todosArray, sortFlag } = this.state
    return (
      <div>
        <FlatButton
          label={sortFlag ? 'ASCENDING' : 'DESCENDING'}
          primary={sortFlag}
          secondary={!sortFlag}
          onTouchTap={() => {
            this.setState({
              todosArray: this.sortDateTime(todosArray, !sortFlag),
              sortFlag: !sortFlag,
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

    const deleteActions = [
      <FlatButton
        label='CANCEL'
        secondary={true}
        onTouchTap={() => this.setState({ deleteFlag: false, })}
      />,
      <FlatButton
        label='OK'
        primary={true}
        onTouchTap={() => this.deleteTodo()}
      />
    ]

    return (
      <div style={styles.root}>
        {!addFlag && !editFlag ? <div>
          <RaisedButton
            label='ADD TODO'
            onTouchTap={() => {
              this.clearTodoForm(),
              this.setState({ addFlag: true, })
            }}
          />
          <this.SortButton />
          {todosArray !== undefined && todosArray.length !== 0 ? todosArray.map((row, index) => {
            return (
              <div key={index} style={styles.card}>
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
                      label='EDIT'
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
                      label='DELETE'
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
          }) : <span><br />There is no Todo List</span>}
        </div> : <div><this.TodoForm /></div>}
        <Dialog
          title='DELETE'
          actions={deleteActions}
          modal={true}
          open={deleteFlag}
          onRequestClose={() => this.setState({deleteFlag: false,})}
        >
          Can I delete it ?
        </Dialog>
      </div>
    )
  }
}
