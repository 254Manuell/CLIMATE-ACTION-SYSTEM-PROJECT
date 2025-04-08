import { AirQualityData, WebSocketMessage } from '../types/air-quality'



export class AirQualityService {
  private ws: WebSocket | null = null
  private subscribers: ((data: AirQualityData) => void)[] = []
  private errorHandlers: ((message: string) => void)[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000 // Start with 1 second

  constructor() {
    this.initializeWebSocket()
  }

  private async initializeWebSocket(): Promise<void> {
    try {
      // Get the token from local storage
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      this.ws = new WebSocket(`ws://localhost:8000/api/v1/ws/air-quality?token=${token}`)

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          
          switch (message.type) {
            case 'air_quality_update':
              if (message.data) {
                this.notifySubscribers(message.data)
              }
              break
            case 'error':
              if (message.message) {
                this.notifyErrorHandlers(message.message)
              }
              break
            default:
              console.warn('Unknown message type:', message)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
          this.notifyErrorHandlers('Invalid message format')
        }
      }

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
        this.reconnectDelay = 1000
      }

      this.ws.onclose = () => {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          console.log(`Reconnecting... Attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts}`)
          setTimeout(() => {
            this.reconnectAttempts++
            this.reconnectDelay *= 2 // Exponential backoff
            this.initializeWebSocket()
          }, this.reconnectDelay)
        } else {
          this.notifyErrorHandlers('WebSocket connection failed after multiple attempts')
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.notifyErrorHandlers('WebSocket connection error')
      }
    } catch (error) {
      this.notifyErrorHandlers(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  private notifySubscribers(data: AirQualityData): void {
    this.subscribers.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error('Error in subscriber callback:', error)
      }
    })
  }

  private notifyErrorHandlers(message: string): void {
    this.errorHandlers.forEach(handler => {
      try {
        handler(message)
      } catch (error) {
        console.error('Error in error handler:', error)
      }
    })
  }

  subscribe(callback: (data: AirQualityData) => void): () => void {
    this.subscribers.push(callback)
    return () => this.unsubscribe(callback)
  }

  onError(handler: (message: string) => void): () => void {
    this.errorHandlers.push(handler)
    return () => this.removeErrorHandler(handler)
  }

  private unsubscribe(callback: (data: AirQualityData) => void): void {
    this.subscribers = this.subscribers.filter(cb => cb !== callback)
  }

  private removeErrorHandler(handler: (message: string) => void): void {
    this.errorHandlers = this.errorHandlers.filter(h => h !== handler)
  }

  updateLocation(latitude: number, longitude: number): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.notifyErrorHandlers('WebSocket is not connected')
      return
    }

    try {
      this.ws.send(JSON.stringify({ latitude, longitude }))
    } catch (error) {
      this.notifyErrorHandlers('Failed to send location update')
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

// Create a singleton instance
export const airQualityService = new AirQualityService();
