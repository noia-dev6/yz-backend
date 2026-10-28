const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../yz_database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Erro ao conectar ao banco:', err.message);
    else console.log('Conectado ao banco de dados SQLite.');
});

// Criar tabelas baseadas no Diagrama Entidade-Relacionamento
db.serialize(() => {
    // Tabela USUARIO
    db.run(`CREATE TABLE IF NOT EXISTS USUARIO (
        id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        senha VARCHAR(255),
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabela CONVERSA
    db.run(`CREATE TABLE IF NOT EXISTS CONVERSA (
        id_conversa INTEGER PRIMARY KEY AUTOINCREMENT,
        id_usuario INTEGER,
        data_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_fim DATETIME,
        FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
    )`);

    // Tabela MENSAGEM
    db.run(`CREATE TABLE IF NOT EXISTS MENSAGEM (
        id_mensagem INTEGER PRIMARY KEY AUTOINCREMENT,
        id_conversa INTEGER,
        tipo VARCHAR(20), -- 'usuario' ou 'yzai'
        conteudo TEXT,
        data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_conversa) REFERENCES CONVERSA(id_conversa)
    )`);

    // Tabela INTERACAO (Controle de interações não cadastradas)
    db.run(`CREATE TABLE IF NOT EXISTS INTERACAO (
        id_interacao INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_usuario VARCHAR(50), -- Usando IP ou ID temporário para simular
        quantidade INT DEFAULT 0,
        data_hora DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

module.exports = db;
