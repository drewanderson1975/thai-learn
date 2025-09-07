// Ambient module declarations for non-code assets.

// Audio
declare module '*.mp3' {
  const src: string
  export default src
}

// YAML
declare module '*.yaml' {
  const data: unknown
  export default data
}
declare module '*.yml' {
  const data: unknown
  export default data
}

// SVG as a React component (Vite + SVGR-style)
declare module '*.svg' {
  import * as React from 'react'
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >
  export default ReactComponent
}