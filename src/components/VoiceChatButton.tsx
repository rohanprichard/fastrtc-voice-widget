import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceChatButtonProps {
    onClick: () => void;
    isConnecting: boolean;
    isConnected: boolean;
    action: 'start' | 'stop';
}

const buttonStyles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '16px',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: '#ffffff',
        border: '2px solid #dbeafe',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        outline: 'none',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '0',
        padding: '0',
    },
    buttonHover: {
        transform: 'scale(1.05)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    buttonFocus: {
        boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5)',
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
        transform: 'none',
    },
    textContainer: {
        textAlign: 'center' as const,
    },
    primaryText: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        margin: '0',
        lineHeight: '1.4',
    },
    secondaryText: {
        fontSize: '12px',
        color: '#6b7280',
        margin: '4px 0 0 0',
        lineHeight: '1.4',
    },
};

const VoiceChatButton: React.FC<VoiceChatButtonProps> = ({ onClick, isConnecting, isConnected, action }) => {
    const getButtonContent = () => {
        if (action === 'start') {
            return (
                <>
                    <Mic size={24} color="#111827" />
                    <span style={{ 
                        position: 'absolute', 
                        width: '1px', 
                        height: '1px', 
                        padding: '0', 
                        margin: '-1px', 
                        overflow: 'hidden', 
                        clip: 'rect(0, 0, 0, 0)', 
                        whiteSpace: 'nowrap', 
                        border: '0' 
                    }}>Start Voice Chat</span>
                </>
            );
        }
        if (action === 'stop') {
            return (
                <>
                    <MicOff size={24} color="#ef4444" />
                    <span style={{ 
                        position: 'absolute', 
                        width: '1px', 
                        height: '1px', 
                        padding: '0', 
                        margin: '-1px', 
                        overflow: 'hidden', 
                        clip: 'rect(0, 0, 0, 0)', 
                        whiteSpace: 'nowrap', 
                        border: '0' 
                    }}>Stop Voice Chat</span>
                </>
            );
        }
        return null;
    };

    const isDisabled = (action === 'start' && (isConnecting || isConnected)) || (action === 'stop' && !isConnected);
    
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const buttonStyle = {
        ...buttonStyles.button,
        ...(isHovered && !isDisabled ? buttonStyles.buttonHover : {}),
        ...(isFocused && !isDisabled ? buttonStyles.buttonFocus : {}),
        ...(isDisabled ? buttonStyles.buttonDisabled : {}),
    };

    return (
        <div style={buttonStyles.container}>
            <button
                onClick={onClick}
                style={buttonStyle}
                disabled={isDisabled}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            >
                {getButtonContent()}
            </button>
            <div style={buttonStyles.textContainer}>
                <p style={buttonStyles.primaryText}>
                    {isConnecting ? "Connecting..." : isConnected ? "Connected" : "Click to start voice chat"}
                </p>
                {isConnected && (
                    <p style={buttonStyles.secondaryText}>
                        Click to disconnect
                    </p>
                )}
            </div>
        </div>
    );
};

export { VoiceChatButton };