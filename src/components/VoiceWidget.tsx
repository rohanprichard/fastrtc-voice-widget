import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceChatButton } from './VoiceChatButton';
import { useWebRTC } from '../hooks/useWebRTC';

export interface VoiceWidgetProps {
  /** API URL for WebRTC backend.*/
  apiUrl: string;
  /** Callback when connection state changes */
  onConnectionChange?: (connected: boolean) => void;
  /** Show device selection controls */
  showDeviceSelection?: boolean;
  /** Custom class name for the container */
  className?: string;
  /** Custom background component (replaces default background) */
  backgroundComponent?: React.ReactNode;
  /** Hide the background entirely */
  hideBackground?: boolean;
}

export function VoiceWidget({
  apiUrl,
  onConnectionChange,
  showDeviceSelection = true,
  className = "",
  backgroundComponent,
  hideBackground = false
}: VoiceWidgetProps) {
  const {
    audioOutputRef,
    isConnecting,
    isConnected,
    inputDevices,
    outputDevices,
    selectedInputDeviceId,
    selectedOutputDeviceId,
    setSelectedInputDeviceId,
    handleOutputDeviceChange,
    handleToggleVoiceChat
  } = useWebRTC({
    apiUrl,
    onConnectionChange
  });

  return (
    <div className={`flex flex-col items-center justify-center h-screen bg-background text-foreground relative ${className}`}>
      {showDeviceSelection && (
        <div className="absolute top-4 left-4 z-20 space-y-3">
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Microphone
                </label>
                <select
                  value={selectedInputDeviceId}
                  onChange={(e) => setSelectedInputDeviceId(e.target.value)}
                  className="w-full min-w-[200px] px-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  disabled={isConnected}
                >
                  {inputDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Speaker
                </label>
                <select
                  value={selectedOutputDeviceId}
                  onChange={(e) => handleOutputDeviceChange(e.target.value)}
                  className="w-full min-w-[200px] px-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  {outputDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {!hideBackground && (
        <div className="absolute inset-0 z-0">
          {backgroundComponent || (
            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800" />
          )}
        </div>
      )}
      
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key="voice-content-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center p-8 rounded-lg bg-transparent"
          >
            <VoiceChatButton
              onClick={handleToggleVoiceChat}
              isConnecting={isConnecting}
              isConnected={isConnected}
              action={isConnected ? "stop" : "start"}
            />
            <audio 
              ref={audioOutputRef} 
              id="fastrtc-voice-widget-audio" 
              controls 
              hidden 
              className="w-full max-w-md mt-4"
            >
              Your browser does not support the audio element.
            </audio>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}