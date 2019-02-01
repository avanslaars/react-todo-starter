import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { RouteConsumer } from './RouterContext'

class Hyperlink extends Component {
  handleClick = evt => {
    evt.preventDefault()
    this.props.linkHandler(this.props.to)
  }

  render() {
    const activeClass = this.props.route === this.props.to ? 'active' : ''
    return (
      <a
        href={this.props.to}
        className={activeClass}
        onClick={this.handleClick}
      >
        {this.props.children}
      </a>
    )
  }
}

export const Link = props => (
  <RouteConsumer>
    {({ route, linkHandler }) => (
      <Hyperlink {...props} route={route} linkHandler={linkHandler} />
    )}
  </RouteConsumer>
)

Hyperlink.propTypes = {
  to: PropTypes.string.isRequired
}
