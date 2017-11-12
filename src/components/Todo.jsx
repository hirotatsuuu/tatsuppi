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
    width: '43vw',
  },
  fullButton: {
    width: '94vw',
  },
  full: {
    width: '100vw',
  },
}

export default class Todo extends Component {
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

  componentWillMount = () => {
    localStorage.setItem('hash', location.hash.slice(2))
  }

  componentDidMount = () => {
    const { auth } = this.state
    this.todosRef = firebase.database().ref('todos/' + auth.uid)
    this.todosRef.on('value', snapshots => {
      this.getTodos(snapshots.val())
    })
    this.groupsRef = firebase.database().ref('groups/' + auth.uid)
    this.groupsRef.on('value', snapshots => {
      this.getGroups(snapshots.val())
    })
  }

  componentWillUnmount = () => {
    this.todosRef.off('value')
    this.groupsRef.off('value')
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
   * Todoの追加
   */
  addTodo = () => {
    const { group, title, text } = this.state
    const dateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const todoObj = {
      group: group,
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
    const { group, title, text, auth, editId } = this.state
    const dateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const editObj = {
      group: group,
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
      group: '未選択',
      title: '',
      text: '',
    })
  }

  /**
   * グループの取得
   */
  getGroups = groups => {
    let groupsArray = []
    if (groups) {
      Object.keys(groups).forEach(snapshot => {
        let group = groups[snapshot]
        group.id = snapshot
        groupsArray.push(group)
      })
    }
    this.setState({
      groups: groupsArray,
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
   * カラーの取得
   */
  getColor = value => {
    const { groups } = this.state
    groups.forEach(group => {
      if (group.group === value) {
        return group.color
      }
    })
    return 'black'
  }

  /**
   * グループ化のセレクトフォーム
   */
  GroupSelect = () => {
    const { group, groups } = this.state
    return (
      <div>
        <SelectField
          hintText='select group'
          floatingLabelText='select group'
          fullWidth={true}
          value={group}
          onChange={(e, i, group) =>
            this.setState({
              group: group,
            })
          }
        >
          <MenuItem
            value='未選択'
            primaryText='未選択'
          />
          {groups.map((item, index) => {
            const color = {
              color: item.color,
            }
            return (
              <MenuItem
                key={index}
                value={item.group}
                primaryText={item.group}
                style={color}
              />
            )
          })}
        </SelectField>
      </div>
    )
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
            <this.GroupSelect />
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
                <RaisedButton
                  label='RETURN'
                  secondary={true}
                  style={styles.button}
                  onTouchTap={() => this.setState({ addFlag: false, })}
                />
                <span> </span>
                <RaisedButton
                  label='OK'
                  primary={true}
                  style={styles.button}
                  onTouchTap={() => this.addTodo()}
                />
              </div> : editFlag ? <div>
                <RaisedButton
                  label='RETURN'
                  secondary={true}
                  style={styles.button}
                  onTouchTap={() => this.setState({ editFlag: false, })}
                />
                <span> </span>
                <RaisedButton
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
      <RaisedButton
        label='CANCEL'
        secondary={true}
        onTouchTap={() => this.setState({ deleteFlag: false, })}
      />,<span> </span>,
      <RaisedButton
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
        {todosArray.map((todo, index) => {
          return (
            <div key={index} style={styles.card}>
              <Card>
                <CardHeader
                  title={<span>{todo.title}</span>}
                  subtitle={todo.datetime}
                  actAsExpander={true}
                  showExpandableButton={true}
                />
                <CardText expandable={true}>
                  <pre>{todo.text}</pre>
                </CardText>
                <CardActions expandable={true}>
                  <div style={styles.center}>
                    <RaisedButton
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
                    <RaisedButton
                      label='EDIT'
                      primary={true}
                      style={styles.button}
                      onTouchTap={() => {
                        this.setState({
                          editFlag: !editFlag,
                          editId: todo.id,
                          group: todo.group,
                          title: todo.title,
                          text: todo.text,
                        })
                      }}
                    />
                  </div>
                </CardActions>
              </Card>
            </div>
            )
          })}
        <this.TodoDelete />
      </div>
    )
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
        style={styles.fullButton}
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
   * Groupの追加ボタン
   */
  GroupAdd = () => {
    const { groupFlag } = this.state
    const groupFlagObj = {
      groupFlag: !groupFlag,
    }
    return (
      <RaisedButton
        label='GROUP SETTINGS'
        secondary={true}
        style={styles.button}
        href='#todogroup'
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
        primary={true}
        style={styles.fullButton}
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
        <div>
          <this.TodoAdd />
        </div>
        <div><br /><this.SortButton /></div>
      </div>
    )
  }

  render() {
    const {
      todosArray,
      groupFlag,
      addFlag,
      editFlag,
      deleteFlag,
    } = this.state

    return (
      <div style={styles.root}>
        <Card>
          {groupFlag ? <this.GroupForm /> : <span>
            {addFlag || editFlag ? <this.TodoForm /> : <span>
              {todosArray !== undefined ? <span>
                <CardActions>
                  <this.TodoActions />
                </CardActions>
                {todosArray.length !== 0 ? <this.TodoList /> : <span>
                  <CardText>
                    There is no Todo
                  </CardText>
                </span>}
              </span> : null}
            </span>}
          </span>}
        </Card>
      </div>
    )
  }
}
