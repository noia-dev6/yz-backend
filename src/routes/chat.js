const express = require('express');
const { getYzaiResponse } = require('../services/ai');
const db = require('../config/database');
const router = express.Router();

router.post('/', async (req, res) => {
    const { mensagem, ip_usuario, is_authenticated } = req.body;

    // Regra de Negócio: Limite de 5 mensagens se não estiver logado
    if (!is_authenticated) {
        db.get(`SELECT quantidade FROM INTERACAO WHERE ip_usuario = ?`, [ip_usuario], async (err, row) => {
            let quantidade = row ? row.quantidade : 0;
            
            if (quantidade >= 5) {
                return res.status(403).json({ error: "Limite gratuito atingido", showModal: true });
            }

            // Atualiza contagem
            if (row) {
                db.run(`UPDATE INTERACAO SET quantidade = quantidade + 1 WHERE ip_usuario = ?`, [ip_usuario]);
            } else {
                db.run(`INSERT INTO INTERACAO (ip_usuario, quantidade) VALUES (?, 1)`, [ip_usuario]);
            }

            const aiResponse = await getYzaiResponse(mensagem);
            res.json({ resposta: aiResponse, interacoesRestantes: 4 - quantidade });
        });
    } else {
        // Fluxo para usuário cadastrado (sem limites, salvar no banco)
        // Aqui adicionaria a lógica de gravar na tabela MENSAGEM e CONVERSA
        const aiResponse = await getYzaiResponse(mensagem);
        res.json({ resposta: aiResponse });
    }
});

module.exports = router;
