export class WebsocketController {
  private url: string;
  private websocket: WebSocket | null = null;
  private heartBeatInterval: number | null = null;
  private messageHandlers: Array<(event: MessageEvent) => void> = [];

  constructor(url: string) {
      this.url = url;
      this.initWebSocket();
  }

  private initWebSocket(): void {
      try {
          this.websocket = new WebSocket(this.url);

          this.websocket.onopen = (event: Event) => {
              console.log('WebSocket connection opened:', event);
              this.startHeartbeat();
          };

          this.websocket.onmessage = (event: MessageEvent) => {
              console.log('Message received:', event.data);
              this.messageHandlers.forEach(handler => handler(event));
          };

          this.websocket.onclose = (event: CloseEvent) => {
              console.log('WebSocket connection closed:', event);
              this.stopHeartbeat();
              this.websocket = null; // Reset the WebSocket reference
          };

          this.websocket.onerror = (error: Event) => {
              console.error('WebSocket error:', error);
              this.stopHeartbeat();
              // Handle the error here
          };
      } catch (error) {
          console.error('Error initializing WebSocket:', error);
      }
  }

  private startHeartbeat(): void {
      this.stopHeartbeat(); // Ensure there's only one heartbeat running at a time

      this.heartBeatInterval = window.setInterval(() => {
          if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
              this.websocket.send(JSON.stringify({ type: 'HEARTBEAT' }));
          }
      }, 30000); // Send heartbeat every 30 seconds
  }

  public stopHeartbeat(): void {
      if (this.heartBeatInterval) {
          clearInterval(this.heartBeatInterval);
          this.heartBeatInterval = null;
      }
  }

  public execute(message: any): void {
      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
          this.websocket.send(JSON.stringify(message));
      } else {
          console.error('WebSocket is not open. ReadyState:', this.websocket?.readyState);
      }
  }

  public addEvent(handler: (event: MessageEvent) => void): void {
      this.messageHandlers.push(handler);
  }


  public disconnectWebSocket(): void {
      if (this.websocket) {
          this.websocket.close();
          this.stopHeartbeat();
          this.websocket = null; // Reset the WebSocket reference
      }
  }
}

