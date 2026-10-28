# Yz - Backend (API)

Este é o servidor Back-End do projeto Yz, desenvolvido com Node.js, Express e SQLite.
Ele cumpre os requisitos do Documento de Engenharia:
- Implementa o Diagrama Entidade-Relacionamento (DER).
- Controla interações gratuitas (RN04, RN05).
- Integra-se com IA validando regras de saúde, nutrição e lesões (RN06, RN07, RN08, RN09).

## Como rodar

1. Certifique-se de ter o Node.js instalado.
2. Abra o terminal nesta pasta e instale as dependências:
   `npm install`
3. Abra o arquivo `.env` e coloque sua **GEMINI_API_KEY** real para a IA funcionar.
4. Inicie o servidor:
   `npm run dev`

A API estará rodando em `http://localhost:3000`.
