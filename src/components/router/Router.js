import React, { Component } from 'react'
import { RouteProvider } from './RouterContext'

const getCurrentPath = () => {
  const path = document.location.pathname
  return path.substring(path.lastIndexOf('/'))
}

export class Router extends Component {
  state = {
    route: getCurrentPath()
  }

  handleLinkClick = route => {
    this.setState({ route })
    window.history.pushState(null, '', route)
  }

  componentDidMount() {
    window.onpopstate = () => {
      this.setState({ route: getCurrentPath() })
    }
  }

  render() {
    return (
      <RouteProvider
        value={{ route: this.state.route, linkHandler: this.handleLinkClick }}
      >
        {this.props.children}
      </RouteProvider>
    )
  }
}
