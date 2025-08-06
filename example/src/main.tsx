import React from 'react';
import { createRoot } from 'react-dom/client';
import { VoiceWidget } from '../../src/index';

function ExampleApp() {
  return (
    <div className="h-screen bg-background">
      <VoiceWidget 
        apiUrl="<Your API URL>"
        onConnectionChange={(connected) => {
          console.log('Voice chat connected:', connected);
        }}
        showDeviceSelection={true}
      />
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<ExampleApp />);