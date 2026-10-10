import { Component } from 'react'

export function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch { return false }
}

/** Static CSS "house" shown if WebGL fails or is unavailable. */
export function SceneFallback() {
  return (
    <div className="absolute inset-0 flex items-end justify-center overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 60% at 60% 50%, rgba(42,82,255,.35), transparent 70%)' }} />
      <svg viewBox="0 0 600 360" className="relative mb-[8%] w-[min(900px,92%)]">
        <defs><linearGradient id="fb" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#9db1ff" /><stop offset="1" stopColor="#2a52ff" /></linearGradient></defs>
        <rect x="60" y="170" width="380" height="140" fill="#e4e9f3" />
        <rect x="220" y="70" width="300" height="110" fill="#111b3a" />
        <rect x="200" y="60" width="340" height="12" fill="#aab3c8" />
        <rect x="90" y="200" width="170" height="80" fill="url(#fb)" opacity=".8" />
        <rect x="250" y="95" width="200" height="60" fill="url(#fb)" opacity=".8" />
        <rect x="40" y="310" width="520" height="6" fill="#0d1634" />
      </svg>
    </div>
  )
}

export class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <SceneFallback /> : this.props.children }
}
