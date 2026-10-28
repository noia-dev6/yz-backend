const Groq = require("groq-sdk");
require('dotenv').config();

const systemInstruction = `
Você é a Yzai, uma assistente virtual de inteligência artificial do aplicativo Yz, focado em musculação em casa.
Regras estritas:
1. Responda APENAS sobre musculação, calistenia, treinos em casa (com ou sem equipamento).
2. NÃO forneça dicas de nutrição, dieta ou outros esportes. Se perguntarem, avise educadamente que seu foco é apenas musculação.
3. Se o usuário relatar gravidez, idade avançada ou ausência de equipamentos, sugira adaptações seguras e exercícios de baixo impacto.
4. Se o usuário relatar dores graves ou lesões, emita IMEDIATAMENTE um aviso legal recomendando que procure um médico ou fisioterapeuta antes de treinar, isentando o app de responsabilidade médica.
5. Seja encorajadora, amigável e use linguagem natural.
`;

async function getYzaiResponse(userMessage) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey.includes('SuaChave')) {
        return "Para a Yzai funcionar de verdade, adicione sua GROQ_API_KEY no arquivo .env do backend!";
    }

    const groq = new Groq({ apiKey });

    try {
        // 1. Busca dinamicamente os modelos ativos e permitidos na sua chave Groq
        const modelsList = await groq.models.list();
        
        // Filtra apenas modelos de texto/chat (removendo áudio, visão ou segurança)
        const activeModels = modelsList.data
            .map(m => m.id)
            .filter(id => !id.includes("whisper") && !id.includes("vision") && !id.includes("guard"));

        if (activeModels.length === 0) {
            return "Nenhum modelo de chat ativo foi encontrado para a sua chave da Groq.";
        }

        // 2. Tenta gerar resposta usando o primeiro modelo ativo retornado pela API
        for (const modelName of activeModels) {
            try {
                const chatCompletion = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: systemInstruction },
                        { role: "user", content: userMessage }
                    ],
                    model: modelName,
                    temperature: 0.7,
                    max_tokens: 1024,
                });

                return chatCompletion.choices[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";
            } catch (err) {
                console.error(`[Groq - ${modelName}] Falha temporária, tentando próximo da lista...`);
            }
        }
    } catch (error) {
        console.error("Erro ao comunicar com a Groq:", error.message);
    }

    return "Tive um problema ao processar sua resposta. Tente novamente em instantes.";
}

module.exports = { getYzaiResponse };