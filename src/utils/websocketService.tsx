class WebSocketService {
  private ws: WebSocket | null = null
  private topicListeners: Record<string, ((message: string) => void)[]> = {}
  private globalMessageListener: ((message: any) => void) | null = null
  private token: string | null = null
  private url: string | null = null
  private requiresToken: boolean

  constructor(requiresToken: boolean = false) {
    this.requiresToken = requiresToken
  }

  setToken(token: string) {
    this.token = token
  }

  connect(url: string, token?: string) {
    if (this.ws) return

    const authToken = token || this.token
    
    if (this.requiresToken && !authToken) {
      throw new Error('Token is required for WebSocket connection')
    }

    this.url = url
    if (authToken) {
      this.token = authToken
    }

    const wsUrl = authToken ? `${url}?token=${encodeURIComponent(authToken)}` : url
    
    this.ws = new WebSocket(wsUrl)

    this.ws.onopen = () => {
      console.log('Connected to WebSocket')
    }

    this.ws.onmessage = (event) => {
      let parsedMessage: any
      try {
        parsedMessage = JSON.parse(event.data)
      } 
      catch (error) {
        console.error('Error parsing WebSocket message:', error)
        parsedMessage = { raw: event.data, error: 'Failed to parse JSON' }
      }

      // Single global listener
      if (this.globalMessageListener) {
        this.globalMessageListener(parsedMessage)
      }

      const { topic, data } = parsedMessage || {}
      if (topic && this.topicListeners[topic]) {
        this.topicListeners[topic].forEach(callback => callback(data))
      }
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected. Reconnecting...', event.code, event.reason)
      this.ws = null
      
      if (this.url && (!this.requiresToken || this.token)) {
        setTimeout(() => this.connect(this.url!, this.token || undefined), 3000)
      }
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  onMessage(callback: (message: any) => void) {
    this.globalMessageListener = callback
  }

  subscribe(topic: string, callback: (message: any) => void) {
    if (!this.topicListeners[topic]) {
      this.topicListeners[topic] = []
    }
    this.topicListeners[topic].push(callback)
  }

  unsubscribe(topic: string, callback: (message: any) => void) {
    this.topicListeners[topic] = this.topicListeners[topic]?.filter(cb => cb !== callback) || []
    if (this.topicListeners[topic].length === 0) {
      delete this.topicListeners[topic]
    }
  }

  send(topic: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ topic, data }))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

export const websocketService = new WebSocketService(false)
export const settingWebsocketService = new WebSocketService(true)
