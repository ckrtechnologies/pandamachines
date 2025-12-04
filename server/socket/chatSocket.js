module.exports = function chatSocket(io) {
    const activeChats = new Map();

    io.on("connection", (socket) => {
        console.log("🔗 User connected:", socket.id);

        // Join user to inquiry room
        socket.on("join-inquiry", (inquiryId) => {
            socket.join(inquiryId);

            if (!activeChats.has(inquiryId)) {
                activeChats.set(inquiryId, []);
            }

            socket.emit("load-messages", activeChats.get(inquiryId));
        });

        // Admin joins inquiry
        socket.on("admin-join-inquiry", (inquiryId) => {
            socket.join(inquiryId);

            if (!activeChats.has(inquiryId)) {
                activeChats.set(inquiryId, []);
            }

            socket.emit("load-messages", activeChats.get(inquiryId));
        });

        // User sends message
        socket.on("user-message", ({ inquiryId, message, userName }) => {
            const chatMessage = {
                id: Date.now().toString(),
                sender: "user",
                message,
                userName,
                timestamp: new Date(),
            };

            activeChats.get(inquiryId).push(chatMessage);
            io.to(inquiryId).emit("new-message", chatMessage);
        });

        // Admin sends message
        socket.on("admin-message", ({ inquiryId, message, adminName }) => {
            const chatMessage = {
                id: Date.now().toString(),
                sender: "admin",
                message,
                adminName,
                timestamp: new Date(),
            };

            activeChats.get(inquiryId).push(chatMessage);
            io.to(inquiryId).emit("new-message", chatMessage);
        });

        // Typing indicators
        socket.on("user-typing", (inquiryId) => {
            socket.to(inquiryId).emit("user-typing-indicator");
        });

        socket.on("admin-typing", (inquiryId) => {
            socket.to(inquiryId).emit("admin-typing-indicator");
        });

        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", socket.id);
        });
    });

    console.log("💬 Chat Socket Initialized");
};
