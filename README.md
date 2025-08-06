# FastRTC Voice Widget

A React component library for WebRTC voice chat functionality.

## Installation

```bash
npm install fastrtc-voice-widget
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install react react-dom framer-motion lucide-react class-variance-authority clsx tailwind-merge @radix-ui/react-slot
```

## Usage

### Basic Usage

```tsx
import React from 'react';
import { VoiceWidget } from 'fastrtc-voice-widget';

function App() {
  return (
    <div className="h-screen">
      <VoiceWidget 
        apiUrl="https://your-api-url.com"
        onConnectionChange={(connected) => {
          console.log('Voice chat connected:', connected);
        }}
      />
    </div>
  );
}
```

### Advanced Usage

```tsx
import React, { useState } from 'react';
import { VoiceWidget, useWebRTC } from 'fastrtc-voice-widget';

function CustomVoiceChat() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <VoiceWidget
      apiUrl="https://your-api-url.com"
      showDeviceSelection={true}
      onConnectionChange={setIsConnected}
      className="custom-voice-widget"
      backgroundComponent={<div className="custom-background" />}
    />
  );
}
```


## Props

### VoiceWidget Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiUrl` | `string` | `required`| WebRTC backend API URL |
| `onConnectionChange` | `(connected: boolean) => void` | `undefined` | Callback when connection state changes |
| `showDeviceSelection` | `boolean` | `true` | Show device selection controls |
| `className` | `string` | `""` | Custom CSS class for container |
| `backgroundComponent` | `React.ReactNode` | `undefined` | Custom background component |
| `hideBackground` | `boolean` | `false` | Hide the default background |


## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the package: `npm run build`
4. The built files will be in the `dist` directory

## API Requirements

This component assumes that you have FastRTC setup and running as an API mounted on a FastAPI app.

It also requires a route that serves the TURN server credentials from some service (I use Twilio). Read the FastRTC docs for more on this. [https://fastrtc.org/reference/credentials/].

(I would also recommend adding some auth to avoid any)

```python
@app.get("/turn-credentials")
async def get_turn_credentials():
    try:
        credentials = get_twilio_turn_credentials()
        return credentials
    except Exception as e:
        logger.error(f"Error with TURN creds: {e}")
```


## License

MIT
