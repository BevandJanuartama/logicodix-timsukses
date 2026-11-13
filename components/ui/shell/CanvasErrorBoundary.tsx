'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  fallback: ReactNode
  children: ReactNode
  onError?: () => void
}

export class CanvasErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError?.()
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
