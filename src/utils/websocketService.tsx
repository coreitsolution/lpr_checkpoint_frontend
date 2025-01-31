class WebSocketService {
  private ws: WebSocket | null = null
  private topicListeners: Record<string, ((message: string) => void)[]> = {}

  connect(url: string) {
    if (this.ws) return 
    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      console.log('Connected to WebSocket')
    }

    this.ws.onmessage = (event) => {
      const { topic, message } = JSON.parse(event.data)

      if (this.topicListeners[topic]) {
        this.topicListeners[topic].forEach(callback => callback(message))
      }
    }

    this.ws.onclose = () => {
      console.log('WebSocket disconnected. Reconnecting...')
      this.ws = null
      setTimeout(() => this.connect(url), 3000)
    }
  }

  subscribe(topic: string, callback: (message: string) => void) {
    if (!this.topicListeners[topic]) {
      this.topicListeners[topic] = []
    }
    this.topicListeners[topic].push(callback)
  }

  unsubscribe(topic: string, callback: (message: string) => void) {
    this.topicListeners[topic] = this.topicListeners[topic]?.filter(cb => cb !== callback) || []
    if (this.topicListeners[topic].length === 0) {
      delete this.topicListeners[topic]
    }
  }
}

export const websocketService = new WebSocketService()
