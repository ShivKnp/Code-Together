import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created a new room");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("ROOM ID & Username are required");
      return;
    }

    // Redirect
    navigate(`/editor/${roomId}`, {
      state: { username },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mt-12 mx-auto h-20 w-auto"
          src="/code-sync.png"
          alt="Code Sync Logo"
        />
        <h2 className="mt-3 text-center text-2xl font-bold text-white ">
          Join Your Room
        </h2>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="roomId"
              className="block text-sm font-medium text-gray-900"
            >
              Room ID
            </label>
            <div className="mt-2">
              <input
                id="roomId"
                name="roomId"
                type="text"
                className="block w-full rounded-md border border-gray-300 py-2 px-4 bg-white text-gray-900 shadow-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-300 ease-in-out hover:border-gray-400 sm:text-sm"
                placeholder="Enter Room ID"
                onChange={(e) => setRoomId(e.target.value)}
                value={roomId}
                onKeyUp={handleInputEnter}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-900"
            >
              Username
            </label>
            <div className="mt-0">
              <input
                id="username"
                name="username"
                type="text"
                className="block w-full rounded-md border border-gray-300 py-2 px-4 bg-white text-gray-900 shadow-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-300 ease-in-out hover:border-gray-400 sm:text-sm"
                placeholder="Enter Username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                onKeyUp={handleInputEnter}
                required
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={joinRoom}
              className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-indigo-600"
            >
              Join
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don’t have a room?{" "}
          <a
            href="#"
            onClick={createNewRoom}
            className="font-semibold text-indigo-600 hover:underline"
          >
            Create a new room
          </a>
        </p>

        <p className="mt-3 text-center text-sm text-gray-500">
          You can also use a custom Room ID of your choice!
        </p>
      </div>

      <footer className="mt-8 text-center text-gray-500">
        Created by&nbsp;
        <a
          href="https://github.com/ShivKnp"
          className="text-indigo-600 hover:underline"
        >
          Shivansh Tiwari
        </a>
      </footer>
    </div>
  );
};

export default Home;
