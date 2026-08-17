# FastRTC Voice Widget

A React component library for adding a WebRTC voice-chat control to an application backed by FastRTC.

## Install

```bash
npm install fastrtc-voice-widget
```

The package expects React, React DOM, Framer Motion, Lucide, Radix Slot, and the listed styling utilities as peer dependencies.

## Quickstart

```tsx
"use client";

import { VoiceWidget } from "fastrtc-voice-widget";

export function SupportVoice() {
  return <VoiceWidget apiUrl="https://your-api.example.com" />;
}
```

Use it from a client component in Next.js because it depends on browser media APIs.

## Backend requirements

The `apiUrl` must point at a compatible FastRTC/FastAPI voice backend. The host application must also provide a `GET /turn-credentials` endpoint that returns short-lived TURN credentials; see the [FastRTC credentials reference](https://fastrtc.org/reference/credentials/).

```python
from fastrtc.credentials import get_twilio_turn_credentials

@app.get("/turn-credentials")
async def turn_credentials():
    return get_twilio_turn_credentials()
```

Do not ship TURN provider secrets to the browser.

## Main props

| Prop | Purpose |
| --- | --- |
| `apiUrl` | Required URL of the FastRTC backend. |
| `onConnectionChange` | Receives voice connection state changes. |
| `showDeviceSelection` | Shows microphone/device controls; defaults to `true`. |
| `className` | Styles the widget container. |
| `menuPosition` | Positions the device-control menu. |

## Development

```bash
npm install
npm run build
```

## Status

The package is a reusable integration component. It does not include a hosted backend or TURN provider; consumers supply both.

## License

MIT
