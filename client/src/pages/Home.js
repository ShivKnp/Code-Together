import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID & username is required');
            return;
        }

        // Redirect
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-md">
                <div className="flex flex-col items-center">
                    <img
                        className="w-20 mb-4"
                        src="/code-sync.png"
                        alt="code-sync-logo"
                    />
                    <h2 className="text-2xl font-bold text-gray-100 mb-6">
                        Your Room is Waiting!!!
                    </h2>
                    <div className="mb-6">
                        <input
                            type="text"
                            className="w-full p-2 mb-4 border border-gray-700 bg-gray-900 rounded-md text-gray-200 placeholder-gray-400"
                            placeholder="ROOM ID"
                            onChange={(e) => setRoomId(e.target.value)}
                            value={roomId}
                            onKeyUp={handleInputEnter}
                        />
                        <input
                            type="text"
                            className="w-full p-2 mb-4 border border-gray-700 bg-gray-900 rounded-md text-gray-200 placeholder-gray-400"
                            placeholder="USERNAME"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            onKeyUp={handleInputEnter}
                        />
                        <button
                            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            onClick={joinRoom}
                        >
                            Join
                        </button>
                    </div>
                    <p className="text-gray-400">
                        If you don't have an invite, create a &nbsp;
                        <a
                            onClick={createNewRoom}
                            href="#"
                            className="text-blue-400 hover:underline"
                        >
                            new room
                        </a>
                    </p>
                </div>
            </div>
            <footer className="mt-8">
                <p className="text-gray-500">
                    Built with ❤️ by&nbsp;
                    <a
                        href="https://github.com/Fearman99"
                        className="text-blue-400 hover:underline"
                    >
                        Shivansh Tiwari
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default Home;
