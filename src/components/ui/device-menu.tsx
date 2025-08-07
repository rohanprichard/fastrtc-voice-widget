
import * as React from 'react';
import { Settings, Mic, Volume2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuItem, DropdownPosition } from './dropdown-menu';

interface AudioDevice {
  deviceId: string;
  label: string;
}

interface DeviceMenuProps {
  inputDevices: AudioDevice[];
  outputDevices: AudioDevice[];
  selectedInputDeviceId: string;
  selectedOutputDeviceId: string;
  onInputDeviceChange: (deviceId: string) => void;
  onOutputDeviceChange: (deviceId: string) => void;
  disabled?: boolean;
  position?: DropdownPosition;
}

const deviceMenuStyles = {
  triggerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  deviceSection: {
    padding: '6px 10px 2px 10px',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '3px',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  },
  deviceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 10px',
    fontSize: '12px',
    color: '#374151',
    background: 'transparent',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'background-color 0.15s ease',
    outline: 'none',
    width: '100%',
    lineHeight: '1.3',
    minHeight: '32px', // Better touch target on mobile
    WebkitTapHighlightColor: 'transparent', // Remove iOS tap highlight
  },
  deviceItemSelected: {
    background: '#eff6ff',
    color: '#2563eb',
    fontWeight: '500',
  },
  deviceItemHover: {
    background: '#f3f4f6',
  },
  divider: {
    height: '1px',
    background: '#e5e7eb',
    margin: '3px 0',
  },
};

export function DeviceMenu({
  inputDevices,
  outputDevices,
  selectedInputDeviceId,
  selectedOutputDeviceId,
  onInputDeviceChange,
  onOutputDeviceChange,
  disabled = false,
  position = 'bottom-right'
}: DeviceMenuProps) {
  if (disabled) {
    return (
      <div style={{ opacity: 0.5, cursor: 'not-allowed' }}>
        <Settings size={16} />
      </div>
    );
  }

  return (
    <DropdownMenu
      position={position}
      trigger={
        <div style={deviceMenuStyles.triggerContent}>
          <Settings size={16} />
        </div>
      }
    >
      <div style={deviceMenuStyles.deviceSection}>
        <div style={deviceMenuStyles.sectionTitle}>
          <Mic size={10} />
          Microphone
        </div>
        {inputDevices.map((device) => (
          <DeviceMenuItem
            key={device.deviceId}
            device={device}
            isSelected={device.deviceId === selectedInputDeviceId}
            onClick={() => onInputDeviceChange(device.deviceId)}
          />
        ))}
      </div>
      
      <div style={deviceMenuStyles.divider} />
      
      <div style={deviceMenuStyles.deviceSection}>
        <div style={deviceMenuStyles.sectionTitle}>
          <Volume2 size={10} />
          Speaker
        </div>
        {outputDevices.map((device) => (
          <DeviceMenuItem
            key={device.deviceId}
            device={device}
            isSelected={device.deviceId === selectedOutputDeviceId}
            onClick={() => onOutputDeviceChange(device.deviceId)}
          />
        ))}
      </div>
    </DropdownMenu>
  );
}

interface DeviceMenuItemProps {
  device: AudioDevice;
  isSelected: boolean;
  onClick: () => void;
}

function DeviceMenuItem({ device, isSelected, onClick }: DeviceMenuItemProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const itemStyle = {
    ...deviceMenuStyles.deviceItem,
    ...(isSelected ? deviceMenuStyles.deviceItemSelected : {}),
    ...(isHovered && !isSelected ? deviceMenuStyles.deviceItemHover : {}),
  };

  return (
    <button
      style={itemStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div style={{
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: isSelected ? '#2563eb' : 'transparent',
        border: `1px solid ${isSelected ? '#2563eb' : '#d1d5db'}`,
        flexShrink: 0,
      }} />
      {device.label || 'Unknown Device'}
    </button>
  );
}