const express = require('express');
// const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors=require('cors');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();


const app = express();


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/signupdb';


//const cors=require('cors');
//const PORT = 5000;


// son());app.use(cors());
// app.use(bodyParser.j

//require('dotenv').config();
//const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })

//app.use(cors());


// ✅ ALLOW CORS
app.use(cors({
  origin: "http://localhost:3000", // allow frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(bodyParser.json());
app.use(express.json());


app.use('/api/auth', authRoutes);



// app.options('*', cors());

// Serve static files from the public folder
// app.use(express.static(path.join(__dirname, 'public')));

// Default route
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'stu.html'));
// });
// DB Connection
//mongoose.connect('mongodb://127.0.0.1:27017/signupdb',
//mongoose.connect(process.env.MONGO_URI, {
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Server
// app.listen(PORT, () => {
//     console.log('Server running on http://localhost:5000');
// });

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});







app.listen(PORT, () => {
    console.log('Server running on http://localhost:5000');
});
