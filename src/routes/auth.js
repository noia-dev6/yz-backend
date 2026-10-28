const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const router = express.Router();

router.post('/register', (req, res) => {
    const { nome, email, senha } = req.body;
    
    bcrypt.hash(senha, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: "Erro ao criptografar senha" });
        
        db.run(`INSERT INTO USUARIO (nome, email, senha) VALUES (?, ?, ?)`, [nome, email, hash], function(err) {
            if (err) return res.status(400).json({ error: "E-mail já cadastrado" });
            
            const token = jwt.sign({ id_usuario: this.lastID }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
            res.json({ token, id_usuario: this.lastID, mensagem: "Cadastro realizado!" });
        });
    });
});

module.exports = router;
