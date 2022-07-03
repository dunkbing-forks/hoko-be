import React from 'react';
import styled from 'styled-components';

const VoiceVisualizerContainer = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: center;
`;

type Props = {
  id: string;
}

export const VoiceVisualizer: React.FC<Props> = ({ id }) => {
  return (
    <VoiceVisualizerContainer>
      <canvas id={`canvas-${id}`} width="100" height="50" />
    </VoiceVisualizerContainer>
  );
};
