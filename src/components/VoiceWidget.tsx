import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { DeviceMenu } from './ui/device-menu';
import { DropdownPosition } from './ui/dropdown-menu';
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
  /** Position of the device menu dropdown */
  menuPosition?: DropdownPosition;
}

// Isolated widget styles - won't be affected by parent app CSS
const widgetStyles = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '24px',
    padding: '8px 16px 8px 8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    boxSizing: 'border-box' as const,
    position: 'relative' as const,
    transition: 'all 0.2s ease',
    maxWidth: '280px',
  },
  containerHover: {
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  micButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#ffffff',
    border: '2px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    flexShrink: 0,
  },
  micButtonActive: {
    background: '#ef4444',
    borderColor: '#dc2626',
  },
  micButtonConnecting: {
    background: '#f59e0b',
    borderColor: '#d97706',
  },
  micButtonHover: {
    transform: 'scale(1.05)',
  },
  micButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
  },
  textContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
    minWidth: 0,
  },
  primaryText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
    margin: 0,
    lineHeight: '1.2',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  secondaryText: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
    lineHeight: '1.2',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  menuContainer: {
    flexShrink: 0,
  },
  audioElement: {
    position: 'absolute' as const,
    visibility: 'hidden' as const,
    width: '1px',
    height: '1px',
  }
};

export function VoiceWidget({
  apiUrl,
  onConnectionChange,
  showDeviceSelection = true,
  className = "",
  menuPosition = 'bottom-right'
}: VoiceWidgetProps) {
  const {
    audioOutputRef,
    isConnecting,
    isConnected,
    inputDevices,
    outputDevices,
    selectedInputDeviceId,
    selectedOutputDeviceId,
    handleInputDeviceChange,
    handleOutputDeviceChange,
    handleToggleVoiceChat
  } = useWebRTC({
    apiUrl,
    onConnectionChange
  });

  const [isHovered, setIsHovered] = React.useState(false);
  const [isMicHovered, setIsMicHovered] = React.useState(false);

  const getStatusText = () => {
    if (isConnecting) return "Connecting...";
    if (isConnected) return "Connected";
    return "Voice Chat";
  };

  const getSecondaryText = () => {
    if (isConnecting) return "Please wait";
    if (isConnected) return "Click to disconnect";
    return "Click to start";
  };

  const getMicIcon = () => {
    if (isConnected) return <MicOff size={20} color="#ffffff" />;
    return <Mic size={20} color={isConnecting ? "#ffffff" : "#6b7280"} />;
  };

  const getMicButtonStyle = () => {
    let style = { ...widgetStyles.micButton };
    
    if (isConnected) {
      style = { ...style, ...widgetStyles.micButtonActive };
    } else if (isConnecting) {
      style = { ...style, ...widgetStyles.micButtonConnecting };
    }
    
    if (isMicHovered && !isConnecting) {
      style = { ...style, ...widgetStyles.micButtonHover };
    }
    
    return style;
  };

  const getContainerStyle = () => {
    let style = { ...widgetStyles.container };
    if (isHovered) {
      style = { ...style, ...widgetStyles.containerHover };
    }
    return style;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        style={getContainerStyle()}
        className={className}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={handleToggleVoiceChat}
          style={getMicButtonStyle()}
          onMouseEnter={() => setIsMicHovered(true)}
          onMouseLeave={() => setIsMicHovered(false)}
          aria-label={isConnected ? "Stop voice chat" : "Start voice chat"}
        >
          {getMicIcon()}
        </button>

        <div style={widgetStyles.textContainer}>
          <div style={widgetStyles.primaryText}>
            {getStatusText()}
          </div>
          <div style={widgetStyles.secondaryText}>
            {getSecondaryText()}
          </div>
        </div>

        {showDeviceSelection && (
          <div style={widgetStyles.menuContainer}>
            <DeviceMenu
              inputDevices={inputDevices}
              outputDevices={outputDevices}
              selectedInputDeviceId={selectedInputDeviceId}
              selectedOutputDeviceId={selectedOutputDeviceId}
              onInputDeviceChange={handleInputDeviceChange}
              onOutputDeviceChange={handleOutputDeviceChange}
              disabled={isConnecting}
              position={menuPosition}
            />
          </div>
        )}

        <audio 
          ref={audioOutputRef} 
          id="fastrtc-voice-widget-audio" 
          style={widgetStyles.audioElement}
        >
          Your browser does not support the audio element.
        </audio>
      </motion.div>
    </AnimatePresence>
  );
}