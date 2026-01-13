const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const telegramRoutes = require("./routes/telegramRoutes");
const userRoutes = require('./routes/userRoutes');
const feedRoutes = require('./routes/feedRoutes');
const articleRoutes = require('./routes/articleRoutes');
const { startScheduler } = require('./services/scheduler');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, 
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('AI RSS Aggregator API is running...');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/feeds', feedRoutes);
app.use('/api/articles', articleRoutes);
app.use("/api/telegram", telegramRoutes);

const port = process.env.PORT || 8081;

const startServer = async () => {
  try {
    await connectDB(); // ⏳ wait
    console.log("MongoDB Connected...");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      startScheduler(); // ✅ safe
    });

  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exit(1);
  }
};

startServer();

