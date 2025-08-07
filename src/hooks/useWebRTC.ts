import { useRef, useState, useEffect, useCallback } from 'react';

interface AudioDevice {
    deviceId: string;
    label: string;
}

interface WebRTCConfig {
    apiUrl: string;
    authToken?: string;
    webrtcIdPrefix?: string;
    onConnectionChange?: (connected: boolean) => void;
}

interface TurnCredentials {
    iceServers: RTCIceServer[];
}

async function getTurnCredentials(apiUrl: string, authToken?: string): Promise<TurnCredentials> {
    try {
        const response = await fetch(`${apiUrl}/webrtc/turn-credentials`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to get TURN credentials: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching TURN credentials:', error);
        return {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        };
    }
}

async function setupWebRTC(
    peerConnection: RTCPeerConnection, 
    audioOutputElement: HTMLAudioElement | null, 
    setIsConnected: React.Dispatch<React.SetStateAction<boolean>>,
    apiUrl: string,
    selectedInputDeviceId?: string
) {
    if (!audioOutputElement) {
        console.error("Audio output element not found, but it's intentionally hidden.");
    }

    try {
        console.log("Requesting microphone permissions...");
        const constraints: MediaStreamConstraints = {
            audio: selectedInputDeviceId ? { 
                deviceId: { exact: selectedInputDeviceId }, 
                noiseSuppression: true, 
                echoCancellation: true, 
                autoGainControl: true 
            } : {
                noiseSuppression: true,
                echoCancellation: true,
                autoGainControl: true
            },
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log("Microphone access granted.");

        stream.getTracks().forEach(track => {
            console.log(`Adding track: ${track.kind}`);
            peerConnection.addTrack(track, stream);
        });

        peerConnection.addEventListener("track", (evt) => {
            console.log(`Track received: ${evt.track.kind}`);
            if (audioOutputElement && audioOutputElement.srcObject !== evt.streams[0]) {
                console.log("Attaching remote stream to audio element (hidden)");
                audioOutputElement.srcObject = evt.streams[0];
                audioOutputElement.play().catch(error => {
                    console.warn("Audio autoplay failed:", error, "User interaction might be required.");
                });
            }
        });

        const dataChannel = peerConnection.createDataChannel("text");
        dataChannel.onopen = () => console.log("Data channel: open");
        dataChannel.onclose = () => console.log("Data channel: closed");
        dataChannel.onerror = (error) => console.error("Data channel error:", error);
        dataChannel.onmessage = (event) => {
            console.log("Data channel message received:", event.data);
        };

        console.log("Creating offer...");
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        console.log("Local description (offer) set.");

        const randomId = Math.random().toString(36).substring(7);
        const webrtc_id = randomId;
        console.log("Generated WebRTC ID:", webrtc_id);

        peerConnection.onicecandidate = ({ candidate }) => {
            if (candidate) {
                console.debug("Sending ICE candidate", candidate);
                fetch(`${apiUrl}/webrtc/offer`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        candidate: candidate.toJSON(),
                        webrtc_id: webrtc_id,
                        type: "ice-candidate",
                    })
                });
            }
        };

        peerConnection.oniceconnectionstatechange = () => {
            console.log(`ICE connection state change: ${peerConnection.iceConnectionState}`);
        };

        peerConnection.onconnectionstatechange = () => {
            console.log(`Connection state change: ${peerConnection.connectionState}`);
            if (peerConnection.connectionState === 'connected') {
                setIsConnected(true);
            } else {
                setIsConnected(false);
            }
        };

        console.log("Sending offer to server...");
        const response = await fetch(`${apiUrl}/webrtc/offer`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sdp: offer.sdp,
                type: offer.type,
                webrtc_id: webrtc_id
            })
        });

        console.log("Offer sent, server responded.");
        const serverResponse = await response.json();
        console.log("Received answer data:", serverResponse);
        await peerConnection.setRemoteDescription(serverResponse);
        console.log("Remote description (answer) set.");

    } catch (error) {
        console.error("Error in WebRTC setup process:", error);
        if (error instanceof Error && error.name === 'NotAllowedError') {
            alert("Microphone access denied. Please allow microphone access in your browser settings.");
        }
    }
}

async function shutdownWebRTC(peerConnection: RTCPeerConnection, setIsConnected: React.Dispatch<React.SetStateAction<boolean>>) {
    console.log("Shutting down WebRTC connection...");
    
    const senders = peerConnection.getSenders();
    senders.forEach(sender => {
        if (sender.track) {
            console.log(`Stopping track: ${sender.track.kind}`);
            sender.track.stop();
        }
    });

    peerConnection.close();
    console.log("WebRTC connection closed and microphone access released.");

    setIsConnected(false);
}

export function useWebRTC(config: WebRTCConfig) {
    const audioOutputRef = useRef<HTMLAudioElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [inputDevices, setInputDevices] = useState<AudioDevice[]>([]);
    const [outputDevices, setOutputDevices] = useState<AudioDevice[]>([]);
    const [selectedInputDeviceId, setSelectedInputDeviceId] = useState<string>('');
    const [selectedOutputDeviceId, setSelectedOutputDeviceId] = useState<string>('');

    const apiUrl = config.apiUrl;

    useEffect(() => {
        if (config.onConnectionChange) {
            config.onConnectionChange(isConnected);
        }
    }, [isConnected, config.onConnectionChange]);

    useEffect(() => {
        const enumerateDevices = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: { noiseSuppression: true, echoCancellation: true, autoGainControl: true } });
                
                const devices = await navigator.mediaDevices.enumerateDevices();
                
                const inputDevs: AudioDevice[] = devices
                    .filter(device => device.kind === 'audioinput')
                    .map(device => ({
                        deviceId: device.deviceId,
                        label: device.label || `Microphone ${device.deviceId.slice(0, 5)}`
                    }));
                
                const outputDevs: AudioDevice[] = devices
                    .filter(device => device.kind === 'audiooutput')
                    .map(device => ({
                        deviceId: device.deviceId,
                        label: device.label || `Speaker ${device.deviceId.slice(0, 5)}`
                    }));
                
                setInputDevices(inputDevs);
                setOutputDevices(outputDevs);
                
                if (!selectedInputDeviceId && inputDevs.length > 0) {
                    setSelectedInputDeviceId(inputDevs[0].deviceId);
                }
                if (!selectedOutputDeviceId && outputDevs.length > 0) {
                    setSelectedOutputDeviceId(outputDevs[0].deviceId);
                }
            } catch (error) {
                console.error('Error enumerating devices:', error);
            }
        };

        const initializePeerConnection = async () => {
            if (typeof window !== "undefined") {
                const rtcConfiguration = await getTurnCredentials(apiUrl, config.authToken);
                console.log('Using RTC configuration:', rtcConfiguration);
                peerConnectionRef.current = new RTCPeerConnection(rtcConfiguration);
            }
        };

        initializePeerConnection();
        enumerateDevices();

        return () => {
            console.log("useWebRTC unmounting. Cleaning up WebRTC connection...");
            if (peerConnectionRef.current && peerConnectionRef.current.connectionState !== 'closed') {
                peerConnectionRef.current.close();
                setIsConnected(false);
                console.log("RTCPeerConnection closed on unmount.");
            }
        };
    }, [apiUrl, config.authToken]);

    const handleOutputDeviceChange = useCallback(async (deviceId: string) => {
        setSelectedOutputDeviceId(deviceId);
        if (audioOutputRef.current && audioOutputRef.current.setSinkId) {
            try {
                await audioOutputRef.current.setSinkId(deviceId);
                console.log(`Audio output device changed to: ${deviceId}`);
            } catch (error) {
                console.error('Error setting audio output device:', error);
            }
        }
    }, []);

    const handleToggleVoiceChat = useCallback(async () => {
        if (isConnected) {
            if (peerConnectionRef.current) {
                await shutdownWebRTC(peerConnectionRef.current, setIsConnected);
            }
        } else {
            if (isConnecting) {
                console.log("Connection attempt already in progress.");
                return;
            }

            if (!peerConnectionRef.current || peerConnectionRef.current.signalingState === 'closed') {
                console.log("Initializing or re-initializing RTCPeerConnection for a new session.");
                if (typeof window !== "undefined") {
                    const rtcConfiguration = await getTurnCredentials(apiUrl, config.authToken);
                    console.log('Using RTC configuration:', rtcConfiguration);
                    peerConnectionRef.current = new RTCPeerConnection(rtcConfiguration);
                } else {
                    console.error("Cannot create RTCPeerConnection: window is not defined.");
                    return;
                }
            }

            if (!peerConnectionRef.current) {
                 console.error("RTCPeerConnection is null even after initialization attempt.");
                 return;
            }

            setIsConnecting(true);
            console.log("Attempting to start voice chat setup...");
            try {
                await setupWebRTC(
                    peerConnectionRef.current, 
                    audioOutputRef.current, 
                    setIsConnected,
                    apiUrl,
                    selectedInputDeviceId,
                );
            } catch (error) {
                console.error("Error during setupWebRTC in handleToggleVoiceChat:", error);
            } finally {
                setIsConnecting(false);
            }
        }
    }, [isConnected, isConnecting, apiUrl, config.authToken, config.webrtcIdPrefix, selectedInputDeviceId]);

    return {
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
    };
}