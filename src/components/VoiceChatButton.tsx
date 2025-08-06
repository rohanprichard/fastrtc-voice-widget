import { Button } from "./ui/button";
import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceChatButtonProps {
    onClick: () => void;
    isConnecting: boolean;
    isConnected: boolean;
    action: 'start' | 'stop';
}

const VoiceChatButton: React.FC<VoiceChatButtonProps> = ({ onClick, isConnecting, isConnected, action }) => {
    const getButtonContent = () => {
        if (action === 'start') {
            return (
                <>
                    <Mic className="h-6 w-6 text-black" />
                    <span className="sr-only">Start Voice Chat</span>
                </>
            );
        }
        if (action === 'stop') {
            return (
                <>
                    <MicOff className="h-6 w-6 text-red-500" />
                    <span className="sr-only">Stop Voice Chat</span>
                </>
            );
        }
        return null;
    };

    return (
        <Button
            onClick={onClick}
            className="rounded-full p-5 w-16 h-16 flex items-center justify-center bg-white/70 from-primary to-primary/70 text-primary-foreground font-semibold hover:from-primary/90 hover:to-primary/60 transition-all duration-300 ease-in-out focus:ring-4 focus:ring-primary/50 disabled:opacity-60"
            disabled={(action === 'start' && (isConnecting || isConnected)) || (action === 'stop' && !isConnected)}
        >
            {getButtonContent()}
        </Button>
    );
};

export { VoiceChatButton };