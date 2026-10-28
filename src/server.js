const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Yz rodando na porta ${PORT}`);
});
