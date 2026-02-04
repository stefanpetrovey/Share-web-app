const express = require('express');
const pool = require('./db');
const app = express();
const PORT = 3001;
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const db = require('./models');


const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);


app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
    res.status(500).send(err.message); // show exact error
  }
});



db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });
});

