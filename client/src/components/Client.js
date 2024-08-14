import React from 'react';
import Avatar from 'react-avatar';

const Client = ({ username }) => {
    return (
        <div className="client flex justify-between items-center gap-x-4 py-1 px-4 bg-gray-900 hover:bg-gray-800 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
            <div className="flex min-w-0 gap-x-4 ">
                <Avatar className="avatarStyle" name={username} size={37} round="90%" />
                <div className="min-w-0 flex-auto ">
                    <p className="userName text-white font-semibold text-sm ">{username}</p>
                    
                </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                
            </div>
        </div>
    );
};

export default Client;
