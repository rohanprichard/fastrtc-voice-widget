# FastRTC Voice Widget Example

This is a simple example showing how to use the FastRTC Voice Widget component.

## Running the Example

1. **Navigate to the example directory:**
   ```bash
   cd example
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser to http://localhost:3000**

## What You'll See

- A full-screen voice widget with device selection controls
- A microphone button that you can click to start/stop voice chat
- Device selection dropdowns for microphone and speaker
- Console logs showing connection status

## How It Works

The example imports the `VoiceWidget` component from the parent directory (`../src/index`) and renders it with basic configuration:

```tsx
<VoiceWidget 
  apiUrl="<Your API URL>"
  onConnectionChange={(connected) => {
    console.log('Voice chat connected:', connected);
  }}
  showDeviceSelection={true}
/>
```

## Customization

You can modify `src/main.tsx` to test different props and configurations of the VoiceWidget component.