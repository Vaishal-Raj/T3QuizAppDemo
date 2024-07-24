const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let roomState = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`Joined room ${roomId}`);

    if (!roomState[roomId]) {
      roomState[roomId] = {
        quizData: null,
        users: {}
      };
    }

    // Reset the user's state when they join the room
    roomState[roomId].users[socket.id] = {
      currentQuestionIndex: 0,
      hasPlayed: false // Track if the user has played
    };

    socket.on("sendQuiz", (data) => {
      const { quizData } = data;
      
      if (roomState[roomId].users[socket.id].hasPlayed) {
        console.log(`User ${socket.id} has already played the quiz`);
        socket.emit("error", { message: "You have already played the quiz" });
        return;
      }

      roomState[roomId].quizData = quizData;
      
      // Reset currentQuestionIndex when a new quiz is sent
      roomState[roomId].users[socket.id].currentQuestionIndex = 0;
      const { currentQuestionIndex } = roomState[roomId].users[socket.id];
      console.log(`Current question index: ${currentQuestionIndex}`);

      if (currentQuestionIndex < quizData.questions.length) {
        const currentQuestion = quizData.questions[currentQuestionIndex];
        console.log(`Starting quiz with question: ${currentQuestion.text}`);
        io.to(socket.id).emit("granted_start", { started: true });
        io.to(socket.id).emit("start_quiz", { message: "Got permission to start quiz", currQuestion: currentQuestion });

        roomState[roomId].users[socket.id].currentQuestionIndex += 1;
      } else {
        console.error(`Invalid currentQuestionIndex: ${currentQuestionIndex}`);
      }
    });
  });

  socket.on("send_answer", (data) => {
    const { roomId, answer } = data;
    console.log(`Received answer from ${socket.id} in room ${roomId}: ${answer}`);

    if (!roomState[roomId] || !roomState[roomId].users[socket.id]) {
      console.error(`Room or user state not found for roomId: ${roomId}, socketId: ${socket.id}`);
      return;
    }

    const userState = roomState[roomId].users[socket.id];
    if (userState.hasPlayed) {
      console.log(`Quiz already finished for user ${socket.id} in room ${roomId}`);
      return;
    }

    const { currentQuestionIndex } = userState;
    const { quizData } = roomState[roomId];
    console.log(`Destructed index: ${currentQuestionIndex}`);

    if (currentQuestionIndex === 0 || currentQuestionIndex > quizData.questions.length) {
      console.error(`Current question index ${currentQuestionIndex} out of bounds for room ${roomId}`);
      return;
    }

    const currentQuestion = quizData.questions[currentQuestionIndex - 1]; // Use current index - 1 for current question
    const correctAnswer = currentQuestion.options.find((opt) => opt.isCorrect)?.text;

    let isCorrect = answer === correctAnswer;
    console.log(`Correct answer: ${correctAnswer}, User answer: ${answer}, Is correct: ${isCorrect}`);

    if (currentQuestionIndex < quizData.questions.length) {
      const nextQuestionIndex = userState.currentQuestionIndex;

      if (nextQuestionIndex < quizData.questions.length) {
        const nextQuestion = quizData.questions[nextQuestionIndex];
        console.log(`Sending next question: ${nextQuestion.text}`);
        socket.emit("next_question", {
          question: nextQuestion,
          isCorrect: isCorrect
        });

        // Increment the current question index
        userState.currentQuestionIndex += 1;
      } else {
        console.log(`Quiz finished for user ${socket.id} in room ${roomId}`);
        socket.emit("quiz_finished", {
          isCorrect: isCorrect
        });
        userState.hasPlayed = true; // Set hasPlayed flag to true
      }
    } else {
      console.log(`Handling the last question for user ${socket.id} in room ${roomId}`);
      socket.emit("quiz_finished", {
        isCorrect: isCorrect
      });
      userState.hasPlayed = true; // Set hasPlayed flag to true
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // Clean up user state on disconnect
    for (let roomId in roomState) {
      if (roomState[roomId].users[socket.id]) {
        delete roomState[roomId].users[socket.id];
        console.log(`User ${socket.id} removed from room ${roomId}`);
      }
    }
  });
});

server.listen(3001, () => {
  console.log("Listening on port 3001");
});
