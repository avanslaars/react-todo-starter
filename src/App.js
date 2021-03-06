import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { TodoForm, TodoList, Footer } from './components/todo'
import {
  addTodo,
  generateId,
  findById,
  toggleTodo,
  updateTodo,
  removeTodo,
  filterTodos
} from './lib/todoHelpers'
import { pipe, partial } from './lib/utils'
import { loadTodos, createTodo, saveTodo, destroyTodo } from './lib/todoService'
import { RouteConsumer } from './components/router/RouterContext'

class TodoApp extends Component {
  state = {
    todos: [],
    currentTodo: ''
  }

  componentDidMount() {
    loadTodos().then(todos => this.setState({ todos }))
  }

  handleRemove = (id, evt) => {
    evt.preventDefault()
    destroyTodo(id)
      .then(() => {
        const updatedTodos = removeTodo(this.state.todos, id)
        this.setState({ todos: updatedTodos })
      })
      .then(() => this.showTempMessage('Todo Removed'))
      .catch(() => this.setState({ errorMessage: 'delete failed' }))
  }

  handleToggle = id => {
    const getToggledTodo = pipe(
      findById,
      toggleTodo
    )
    const updated = getToggledTodo(id, this.state.todos)
    saveTodo(updated)
      .then(() => {
        const getUpdatedTodos = partial(updateTodo, this.state.todos)
        const updatedTodos = getUpdatedTodos(updated)
        this.setState({ todos: updatedTodos })
      })
      .then(() => this.showTempMessage('Todo Updated'))
      .catch(() => this.setState({ errorMessage: 'update failed' }))
  }

  handleSubmit = evt => {
    evt.preventDefault()
    const newId = generateId()
    const newTodo = {
      id: newId,
      name: this.state.currentTodo,
      isComplete: false
    }
    createTodo(newTodo)
      .then(() => {
        const updatedTodos = addTodo(this.state.todos, newTodo)
        this.setState({
          todos: updatedTodos,
          currentTodo: '',
          errorMessage: ''
        })
      })
      .then(() => this.showTempMessage('Todo added'))
      .catch(() => this.setState({ errorMessage: 'create failed' }))
  }

  showTempMessage = msg => {
    this.setState({ message: msg })
    setTimeout(() => this.setState({ message: '' }), 2500)
  }

  handleEmptySubmit = evt => {
    evt.preventDefault()
    this.setState({
      errorMessage: 'Please supply a todo name'
    })
  }

  handleInputChange = evt => {
    this.setState({
      currentTodo: evt.target.value
    })
  }

  render() {
    const submitHandler = this.state.currentTodo
      ? this.handleSubmit
      : this.handleEmptySubmit
    const displayTodos = filterTodos(this.state.todos, this.props.route)
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Todos</h2>
        </div>
        <div className="Todo-App">
          {this.state.errorMessage && (
            <span className="error">{this.state.errorMessage}</span>
          )}
          {this.state.message && (
            <span className="success">{this.state.message}</span>
          )}
          <TodoForm
            handleInputChange={this.handleInputChange}
            currentTodo={this.state.currentTodo}
            handleSubmit={submitHandler}
          />
          <TodoList
            handleToggle={this.handleToggle}
            todos={displayTodos}
            handleRemove={this.handleRemove}
          />
          <Footer />
        </div>
      </div>
    )
  }
}

export default () => (
  <RouteConsumer>{({ route }) => <TodoApp route={route} />}</RouteConsumer>
)
