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

## Styling Isolation

The FastRTC Voice Widget is designed to prevent CSS conflicts with your application. It uses specific Tailwind CSS classes instead of semantic theme variables, ensuring the widget maintains its appearance regardless of your app's styling.

### ✅ No Conflicts

Your app can safely use semantic classes like `bg-primary`, `text-foreground`, etc., while the widget uses its own isolated color scheme:

```tsx
function App() {
  return (
    <div>
      {/* Your app's theme */}
      <header className="bg-primary text-primary-foreground p-4">
        <h1>My App</h1>
      </header>
      
      {/* Widget with isolated styling */}
      <VoiceWidget apiUrl="your-api-url" />
    </div>
  );
}
```

The widget uses specific classes like:
- `bg-blue-600` instead of `bg-primary`
- `text-gray-900` instead of `text-foreground`
- `border-gray-200` instead of `border-border`

This ensures zero conflicts with your application's design system.

## Framework Compatibility

### Next.js App Router

The widget is fully compatible with Next.js App Router. Since it uses React hooks and browser APIs, you must use it in client components:

```tsx
'use client';

import { VoiceWidget } from 'fastrtc-voice-widget';

export default function VoicePage() {
  return (
    <div>
      <h1>Voice Chat Page</h1>
      <VoiceWidget apiUrl="your-api-url" />
    </div>
  );
}
```

### Next.js Pages Router

Works seamlessly with Pages Router without any additional configuration:

```tsx
// pages/voice.tsx
import { VoiceWidget } from 'fastrtc-voice-widget';

export default function VoicePage() {
  return <VoiceWidget apiUrl="your-api-url" />;
}
```

### Create React App & Vite

Works out of the box with any standard React setup:

```tsx
import { VoiceWidget } from 'fastrtc-voice-widget';

function App() {
  return <VoiceWidget apiUrl="your-api-url" />;
}
```

## Usage

### Basic Usage

```tsx
'use client'; // Required for Next.js App Router

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
