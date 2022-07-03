import React, { forwardRef } from 'react';
import { Video, VideoContainer, VoiceVisualizer } from '../atoms';

type Props = {
  autoPlay: boolean;
  playsInline: boolean;
  muted: boolean;
};
type Ref = HTMLVideoElement;

export const LocalVideo = forwardRef<Ref, Props>((props, ref) => {
  // it causes echoing local video voice even if we past mute prop to video element.
  // useCalculateVoiceVolume(ref?.current?.srcObject, 'local');

  return (
    <VideoContainer>
      <VoiceVisualizer id="local" />
      <Video {...props} ref={ref} />
    </VideoContainer>
  );
});
