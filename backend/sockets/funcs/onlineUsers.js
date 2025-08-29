exports.roomOnlineUsersCount = async (io, roomId) => {
	const count = io.sockets.adapter.rooms.get(roomId)?.size || 0;
	io.to(roomId).emit("chat:onlineUsers", count);
};
