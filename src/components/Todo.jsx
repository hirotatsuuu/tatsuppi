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
    padding: '65px 1vw 65px',
    width: '98vw',
  },
  error: {
    color: 'red',
  },
  card: {
    padding: '0.5vh 1vw',
    width: '96vw',
  },
  center: {
    textAlign: 'center',
  },
  button: {
    width: '40vw',
  },
  full: {
    width: '100vw',
  },
}

export default class Todo extends Component {
  state = {
    auth: firebase.auth().currentUser,
    title: '',
    text: '',
    addFlag: false,
    editFlag: false,
    deleteFlag: false,
    sortFlag: true,
  }

  componentWillMount = () => {
    localStorage.setItem('hash', location.hash.slice(2))
  }

  componentDidMount = () => {
    const { auth } = this.state
    this.todosRef = firebase.database().ref('todos/' + auth.uid)
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
      if (before.datetime < after.datetime) {
        return (flag ? 1 : -1)
      } else if (before.datetime > after.datetime) {
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
      datetime: dateTime,
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
    const { title, text, auth, editId } = this.state
    const dateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const editObj = {
      title: title,
      datetime: dateTime,
      text: text,
    }
    firebase.database().ref('todos/' + auth.uid + '/' + editId).update(editObj).then(() => {
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
    const { auth, deleteId } = this.state
    firebase.database().ref('todos/' + auth.uid + '/' + deleteId).remove().then(() => {
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
        <Card>
          <CardHeader
            title={addFlag ? <div>ADD TODO</div> : editFlag ? <div>EDIT TODO</div> : null}
          />
          <CardText>
            <TextField
              hintText='title'
              floatingLabelText='title'
              fullWidth={true}
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
              fullWidth={true}
              value={text}
              onChange={e => {
                const value = e.target.value
                this.setState({
                  text: value,
                })
              }}
            />
          </CardText>
          <CardActions>
            <div style={styles.center}>
              {addFlag ? <div>
                <FlatButton
                  label='RETURN'
                  secondary={true}
                  style={styles.button}
                  onTouchTap={() => this.setState({ addFlag: false, })}
                />
                <span> </span>
                <FlatButton
                  label='OK'
                  primary={true}
                  style={styles.button}
                  onTouchTap={() => this.addTodo()}
                />
              </div> : editFlag ? <div>
                <FlatButton
                  label='RETURN'
                  secondary={true}
                  style={styles.button}
                  onTouchTap={() => this.setState({ editFlag: false, })}
                />
                <span> </span>
                <FlatButton
                  label='OK'
                  primary={true}
                  style={styles.button}
                  onTouchTap={() => this.editTodo()}
                />
              </div> : null}
            </div>
          </CardActions>
        </Card>
      </div>
    )
  }

  /**
   * Todoの削除
   */
  TodoDelete = () => {
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
    const { deleteFlag } = this.state
    return (
      <div>
        <Dialog
          title='DELETE'
          actions={deleteActions}
          open={deleteFlag}
          contentStyle={styles.full}
          onRequestClose={() => this.setState({deleteFlag: false,})}
        >
          Can I delete it ?
        </Dialog>
      </div>
    )
  }

  /**
   * Todo一覧
   */
  TodoList = () => {
    const {
      todosArray,
      editFlag,
      deleteFlag,
    } = this.state
    return (
      <div>
        {todosArray.map((todo, index) => (
          <div key={index} style={styles.card}>
            <Card>
              <CardHeader
                title={todo.title}
                subtitle={todo.datetime}
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText expandable={true}>
                <pre>{todo.text}</pre>
              </CardText>
              <CardActions expandable={true}>
                <div style={styles.center}>
                  <FlatButton
                    label='DELETE'
                    secondary={true}
                    style={styles.button}
                    onTouchTap={() => {
                      this.setState({
                        deleteFlag: !deleteFlag,
                        deleteId: todo.id,
                      })
                    }}
                  />
                  <span> </span>
                  <FlatButton
                    label='EDIT'
                    primary={true}
                    style={styles.button}
                    onTouchTap={() => {
                      this.setState({
                        editFlag: !editFlag,
                        editId: todo.id,
                        title: todo.title,
                        text: todo.text,
                      })
                    }}
                  />
                </div>
              </CardActions>
            </Card>
          </div>
        ))}
        <this.TodoDelete />
      </div>
    )
  }

  /**
   * ソートのボタン
   */
  SortButton = () => {
    const { todosArray, sortFlag } = this.state
    return (
      <FlatButton
        label={sortFlag ? 'ASCENDING' : 'DESCENDING'}
        primary={sortFlag}
        secondary={!sortFlag}
        style={styles.button}
        onTouchTap={() => {
          this.setState({
            todosArray: this.sortDateTime(todosArray, !sortFlag),
            sortFlag: !sortFlag,
          })
        }}
      />
    )
  }

  /**
   * Todoの追加ボタン
   */
  TodoAdd = () => {
    const { addFlag } = this.state
    return (
      <RaisedButton
        label='ADD TODO'
        style={styles.button}
        onTouchTap={() => {
          this.clearTodoForm(),
          this.setState({ addFlag: !addFlag, })
        }}
      />
    )
  }

  /**
   * アクション
   */
  TodoActions = () => {
    return (
      <div style={styles.center}>
        <this.SortButton />
        <span> </span>
        <this.TodoAdd />
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

    return (
      <div style={styles.root}>
        {addFlag || editFlag ? <Card>
          <this.TodoForm />
        </Card> : <Card>
          {todosArray !== undefined ? <sapn>
            <CardActions>
              <this.TodoActions />
            </CardActions>
            {todosArray.length !== 0 ? <this.TodoList /> : <CardText>
              There is no Todo
            </CardText>}
          </sapn> : null}
        </Card>}
      </div>
    )
  }
}
