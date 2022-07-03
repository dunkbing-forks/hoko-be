import {RefObject, useEffect, useMemo, useState} from 'react';
import { createPeerConnectionContext } from '../utils/PeerConnectionSession';

export const useStartPeerSession = (
  room: string,
  userMediaStream: MediaStream | null,
  localVideoRef: RefObject<HTMLVideoElement>,
) => {
  const peerVideoConnection = useMemo(() => createPeerConnectionContext(), []);

  const [displayMediaStream, setDisplayMediaStream] = useState<MediaStream | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<Array<string>>([]);

  useEffect(() => {
    if (userMediaStream) {
      peerVideoConnection.joinRoom(room);
      peerVideoConnection.onAddUser((user) => {
        setConnectedUsers((users) => [...users, user]);
        peerVideoConnection.addPeerConnection(`${user}`, userMediaStream, (_stream) => {
          (document.getElementById(user) as HTMLMediaElement).srcObject = _stream;
        });
        void peerVideoConnection.callUser(user);
      });

      peerVideoConnection.onRemoveUser((socketId) => {
        setConnectedUsers((users) => users.filter((user) => user !== socketId));
        peerVideoConnection.removePeerConnection(socketId);
      });

      peerVideoConnection.onUpdateUserList(async (users) => {
        setConnectedUsers(users);
        for (const user of users) {
          peerVideoConnection.addPeerConnection(`${user}`, userMediaStream, (_stream) => {
            (document.getElementById(user) as HTMLMediaElement).srcObject = _stream;
          });
        }
      });

      peerVideoConnection.onAnswerMade((socket) => peerVideoConnection.callUser(socket));
    }

    return () => {
      if (userMediaStream) {
        peerVideoConnection.clearConnections();
        userMediaStream?.getTracks()?.forEach((track) => track.stop());
      }
    };
  }, [peerVideoConnection, room, userMediaStream]);

  const cancelScreenSharing = () => {
    const senders = peerVideoConnection.senders.filter((sender) => sender.track?.kind === 'video');

    if (senders.length) {
      senders.forEach((sender) => {
        const track = userMediaStream?.getTracks()?.find((track) => track.kind === 'video') || null;
        void sender.replaceTrack(track);
      });
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = userMediaStream;
    }
    displayMediaStream?.getTracks()?.forEach((track) => track.stop());
    setDisplayMediaStream(null);
  };

  const shareScreen = async () => {
    const stream = displayMediaStream || (await navigator.mediaDevices.getDisplayMedia());

    const senders = peerVideoConnection.senders.filter((sender) => sender.track?.kind === 'video');

    if (senders) {
      senders.forEach((sender) => sender.replaceTrack(stream.getTracks()[0]));
    }

    stream.getVideoTracks()[0].addEventListener('ended', () => {
      void cancelScreenSharing();
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    setDisplayMediaStream(stream);
  };

  return {
    connectedUsers,
    peerVideoConnection,
    shareScreen,
    cancelScreenSharing,
    isScreenShared: !!displayMediaStream,
  };
};
