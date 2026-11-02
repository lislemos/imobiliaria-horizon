import type { ErrorPayload, HotPayload, Plugin } from 'vite'

// Reenvia o último erro quando o preview reconecta, até a compilação voltar a funcionar.
export function figmaErrorOverlayReplay(): Plugin {
  return {
    name: 'figma-error-overlay-replay',
    apply: 'serve',
    configureServer(server) {
      let lastError: ErrorPayload | null = null

      const originalSend = server.ws.send.bind(server.ws)
      server.ws.send = (payload: HotPayload | string, data?: unknown) => {
        if (typeof payload === 'string') {
          originalSend(payload, data)
          return
        }

        if (payload.type === 'error') {
          lastError = payload
        } else if (payload.type === 'update' || payload.type === 'full-reload') {
          lastError = null
        }
        originalSend(payload)
      }

      server.ws.on('connection', (socket) => {
        if (lastError !== null) {
          socket.send(JSON.stringify(lastError))
        }
      })
    },
  }
}
