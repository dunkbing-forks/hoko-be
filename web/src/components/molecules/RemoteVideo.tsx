import React, { useEffect, useState } from 'react';
import { useCalculateVoiceVolume } from '../../hooks';
import { Video, VideoContainer, VoiceVisualizer } from '../atoms';

type Props = {
  id: string;
  autoPlay: boolean;
  playsInline: boolean;
}

export const RemoteVideo: React.FC<Props> = (props) => {
  const { id } = props;
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useCalculateVoiceVolume(mediaStream, id);

  useEffect(() => {
    const interval = setInterval(() => {
      const stream = (document.getElementById(id) as HTMLMediaElement)?.srcObject as MediaStream;

      if (stream) {
        setMediaStream(stream);
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [id]);

  return (
    <VideoContainer>
      <VoiceVisualizer id={id} />
      <Video {...props} />
    </VideoContainer>
  );
};
