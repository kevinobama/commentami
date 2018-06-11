import React from 'react'
import warning from 'warning'
import { commentsCount } from '../../state/selectors'
import { ResourceContext } from './Resource'

export function flexibleRender({ render, component: Component, children }, renderProps, defaultComponent) {
  if (!Component) Component = defaultComponent

  // render prop takes precedence over component prop - Last resource is to just render components
  if (typeof render === 'function') {
    return render(renderProps)
  } else if (Component) {
    return <Component {...renderProps} />
  } else {
    return children
  }
}

export function withComments(Component) {
  return class extends React.Component {
    get hasCommentable() {
      // This check works since the consumer will provide the context default value, which is 'commentable'
      return this.commentable && this.commentable !== 'commentable'
    }

    get hasComments() {
      return this.hasCommentable && this.props.reference && !!commentsCount(this.commentable, this.props.reference)
    }

    _checkProps() {
      warning(this.hasCommentable, `The commentable component should be inside a Resource`)
    }

    _renderInner(commentable) {
      this.commentable = commentable

      return <Component {...this._renderProps()} />
    }

    _renderProps() {
      const additionalProps = {
        commentable: this.commentable,
        resource: (this.commentable || {}).resource,
        hasComments: this.hasComments
      }
      const callbacks = {
        addComment: this.addComment.bind(this),
        removeComment: this.removeComment.bind(this)
      }

      return { ...additionalProps, ...callbacks, ...this.props }
    }

    addComment(reference, content) {
      return this.commentable.addComment(reference, content)
    }

    removeComment(comment) {
      return this.commentable.removeComment(comment)
    }

    componentDidMount() {
      this._checkProps()
    }

    componentDidUpdate() {
      this._checkProps()
    }

    render() {
      return <ResourceContext.Consumer>{commentable => this._renderInner(commentable)}</ResourceContext.Consumer>
    }
  }
}

export function withReference(Component) {
  return withComments(
    class extends React.Component {
      // TODO@PI: Make sure the reference is unique within the provider
      _checkProps() {
        warning(this.props.reference, `The commentable block component should have a reference prop`)
      }

      componentDidMount() {
        this._checkProps()
      }

      componentDidUpdate() {
        this._checkProps()
      }

      render() {
        return <Component {...this.props} />
      }
    }
  )
}