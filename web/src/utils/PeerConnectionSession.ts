import {io, Socket} from 'socket.io-client';

const { RTCPeerConnection, RTCSessionDescription } = window;

function capitalizeFirstLetter(str: string) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

class PeerConnectionSession {
  _onConnected: ((event: Event, id: string) => void) | null = null;
  _onDisconnected: ((event: Event, id: string) => void) | null = null;
  _room = "";
  peerConnections: Record<string, RTCPeerConnection> = {};
  senders: Array<RTCRtpSender> = [];
  listeners: Record<string, (evt: Event) => void> = {};
  private socket:  Socket;

  constructor(_socket: Socket) {
    this.socket = _socket;
    this.onCallMade();
  }

  addPeerConnection(id: string, stream: MediaStream, callback: (stream: MediaStream) => void) {
    this.peerConnections[id] = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    stream.getTracks().forEach((track) => {
      this.senders.push(this.peerConnections[id].addTrack(track, stream));
    });

    this.listeners[id] = (event) => {
      const fn = (this as any)[`_on${capitalizeFirstLetter(this.peerConnections[id].connectionState)}`];
      fn && fn(event, id);
    };

    this.peerConnections[id].addEventListener('connectionstatechange', this.listeners[id]);

    this.peerConnections[id].ontrack = function ({ streams: [stream] }) {
      console.log({ id, stream });
      callback(stream);
    };

    console.log(this.peerConnections);
  }

  removePeerConnection(id: string) {
    this.peerConnections[id].removeEventListener('connectionstatechange', this.listeners[id]);
    delete this.peerConnections[id];
    delete this.listeners[id];
  }

  async callUser(to: string) {
    if (this.peerConnections[to].iceConnectionState === 'new') {
      const offer = await this.peerConnections[to].createOffer();
      await this.peerConnections[to].setLocalDescription(new RTCSessionDescription(offer));

      this.socket.emit('call-user', { offer, to });
    }
  }

  onConnected(callback: (event: Event, id: string) => void) {
    this._onConnected = callback;
  }

  onDisconnected(callback: (event: Event, id: string) => void) {
    this._onDisconnected = callback;
  }

  joinRoom(room: string) {
    this._room = room;
    this.socket.emit('join-room', room);
  }

  onCallMade() {
    this.socket.on('call-made', async (data) => {
      await this.peerConnections[data.socket].setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await this.peerConnections[data.socket].createAnswer();
      await this.peerConnections[data.socket].setLocalDescription(new RTCSessionDescription(answer));

      this.socket.emit('make-answer', {
        answer,
        to: data.socket,
      });
    });
  }

  onAddUser(callback: (socketId: string) => void) {
    this.socket.on(`${this._room}-add-user`, async ({ user }) => {
      callback(user);
    });
  }

  onRemoveUser(callback: (socketId: string) => void) {
    this.socket.on(`${this._room}-remove-user`, ({ socketId }) => {
      callback(socketId);
    });
  }

  onUpdateUserList(callback: (users: Array<string>, current: string) => void) {
    this.socket.on(`${this._room}-update-user-list`, ({ users, current }) => {
      callback(users, current);
    });
  }

  onAnswerMade(callback: (socketId: string) => void) {
    this.socket.on('answer-made', async (data) => {
      await this.peerConnections[data.socket].setRemoteDescription(new RTCSessionDescription(data.answer));
      callback(data.socket);
    });
  }

  clearConnections() {
    this.socket.close();
    this.senders = [];
    Object.keys(this.peerConnections).forEach(this.removePeerConnection.bind(this));
  }
}

export const createPeerConnectionContext = () => {
  const socket = io(`${process.env.REACT_APP_SOCKET_URL}`, { transports: ["websocket"] });
  console.log(process.env.REACT_APP_SOCKET_URL);

  return new PeerConnectionSession(socket);
};
