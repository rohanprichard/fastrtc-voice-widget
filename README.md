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
'use client';

import React from 'react';
import { VoiceWidget } from 'fastrtc-voice-widget';

function App() {
  return (
    <div className="h-screen">
      <VoiceWidget 
        apiUrl="https://your-api-url.com"
      />
    </div>
  );
}
```

> **Note**: This widget uses React hooks and browser APIs, so it must be used in a client component. Add `'use client';` directive when using with Next.js App Router.

### Advanced Usage

```tsx
'use client';

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


## API Requirements

This component assumes that you have FastRTC setup and running as an API mounted on a FastAPI app.
**Example coming soon**

It also requires a route, shown below, that serves a TURN server's details from some service (I use Twilio). Read the FastRTC docs for more on this as well as why you need a TURN server. [https://fastrtc.org/reference/credentials/].


```python
from fastrtc.credentials import get_twilio_turn_credentials

@app.get("/turn-credentials")
async def get_turn_credentials():
    try:
        credentials = get_twilio_turn_credentials()
        return credentials
    except Exception as e:
        logger.error(f"some error: {e}")
```


## License

MIT
