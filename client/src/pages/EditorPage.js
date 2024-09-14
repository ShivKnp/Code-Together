import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", handleErrors);
      socketRef.current.on("connect_failed", handleErrors);

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) =>
          prev.filter((client) => client.socketId !== socketId)
        );
      });
    };

    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  };

  const leaveRoom = () => reactNavigator("/");

  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };

  if (!location.state) return <Navigate to="/" />;

  return (
    <div className={`flex ${isFullScreen ? 'h-screen w-screen' : 'flex-col md:flex-row h-screen'} bg-gray-900 overflow-hidden`}>
      {!isFullScreen && (
        <div className="aside border-r border-gray-700 w-full md:w-1/5 p-4 bg-gray-800 text-gray-100">
          <div className="asideInner mb-6">
            <div className="logo flex justify-center">
              <img
                className="w-20 mb-4"
                src="/code-sync.png"
                alt="logo"
              />
            </div>
          </div>
          <h3 className="text-center font-semibold text-blue-400 mb-4 transition-transform transform hover:scale-105">
            Connected Members
          </h3>
          <div className="clientsList space-y-2">
            {clients.length > 0 ? (
              clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))
            ) : (
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="client flex justify-between items-center gap-x-6 py-5 px-4 bg-gray-700 rounded-lg"
                >
                  <div className="flex min-w-0 gap-x-4">
                    <div className="h-10 w-10 bg-gray-600 rounded-full"></div>
                    <div className="min-w-0 flex-auto">
                      <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
           <div className="buttonContainer">
    <button
      className="roomIdButton"
      onClick={copyRoomId}
    >
      Room ID
    </button>
    <button
      className="leaveButton"
      onClick={leaveRoom}
    >
      Leave
    </button>
</div>
        </div>
      )}
      <div className={`editorWrap flex-1 relative ${isFullScreen ? 'p-0' : 'p-2'}`}>
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
          isFullScreen={isFullScreen}
          toggleFullScreen={toggleFullScreen}
        />
      </div>
    </div>
  );
};

export default EditorPage;
