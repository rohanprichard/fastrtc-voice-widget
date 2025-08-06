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

## CSS Requirements

This component uses Tailwind CSS classes. Make sure you have Tailwind CSS configured in your project with the following classes available:

- Layout: `flex`, `items-center`, `justify-center`, `h-screen`, `relative`, `absolute`, etc.
- Colors: `bg-background`, `text-foreground`, `bg-card`, `border-border`, etc.
- Spacing: `p-4`, `m-4`, `space-y-3`, etc.

If you're using a custom design system, you may need to override these classes.

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the package: `npm run build`
4. The built files will be in the `dist` directory

## License

MIT
