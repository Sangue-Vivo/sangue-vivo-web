# Sangue Vivo - Visao Geral do Projeto

## O que e o Sangue Vivo?

Plataforma web gamificada que conecta estudantes universitarios de Alagoas aos hemocentros da regiao, incentivando a doacao de sangue atraves de um sistema de ranks, conquistas e XP.

## Publico-alvo

Estudantes universitarios de Maceio/Alagoas, com foco nas principais instituicoes:
- Publicas: UFAL, UNEAL, UNCISAL, IFAL
- Privadas: CESMAC, UNIT, FITS, UNINASSAU, Estacio, FACIMA, FAA, SEUNE, FRM, Madre Tereza, Anhanguera, Sao Marcos
- Opcao "Outra" para faculdades EAD ou nao listadas

## Funcionalidades Principais

### 1. Sistema de Gamificacao
- **7 ranks**: Gota > Bronze > Prata > Ouro > Platina > Diamante > Heroi de Sangue
- **XP**: Base 100 por doacao, +50 por causa, +30 por urgencia, +10 por streak
- **10 conquistas** desbloqueaveis (primeira doacao, streaks, causas, vidas salvas, ranks)
- **Leaderboard** global e por universidade

### 2. Sistema de Causas
- Campanhas de doacao com nivel de urgencia (1-5)
- Meta de doacoes por causa
- Matching por tipo sanguineo compativel
- Status: Ativa, Cumprida, Expirada

### 3. Compatibilidade Sanguinea
- Matriz completa de compatibilidade (8 tipos: A+, A-, B+, B-, AB+, AB-, O+, O-)
- Filtragem automatica de causas compativeis com o tipo do usuario
- Reconhecimento de doador universal (O-)

### 4. Gestao de Doacoes
- Agendamento com data, hospital e cidade
- Vinculacao a causas especificas
- Historico completo com XP ganho
- Controle de elegibilidade (cooldown de 3 meses)
- Streak de doacoes consecutivas

### 5. Autenticacao
- Registro com CPF (validacao de digitos verificadores), email, tipo sanguineo, universidade, curso
- Login com email + senha
- Prevencao de duplicatas por email e CPF
- Persistencia no localStorage (Zustand persist)
- Guards de rota: protegidas (requer auth) e publicas (redireciona se ja logado)

### 6. Painel Admin (em desenvolvimento)
- Dashboard com KPIs e graficos
- Gestao de usuarios, causas, doacoes, conquistas
- Broadcast de notificacoes
- Filtros avancados

### 7. Conteudo Educacional
- Pagina educativa sobre doacao de sangue
- Requisitos para doacao na landing page

### 8. Mapa de Hemocentros
- Integracao com Leaflet/React Leaflet
- Hemocentros parceiros: Hemoal Maceio e Hemoal Arapiraca

## Status Atual

### Implementado
- Landing page completa com animacoes (onda animada, checks com spring, coracao pulsante)
- Sistema de autenticacao funcional (registro + login + logout)
- Dashboard do usuario com stats, rank, causas compativeis, conquistas
- Listagem e detalhes de causas
- Sistema de ranking/leaderboard
- Historico de doacoes
- Perfil do usuario
- Pagina de conquistas
- Pagina educacional
- Configuracoes
- Mapa de hemocentros
- Notificacoes in-app
- Layout responsivo (sidebar desktop + bottom nav mobile)

### Pendente
- Backend real (atualmente tudo e mock/frontend-only)
- Hashamento de senhas (bcrypt/Argon2 no backend)
- API REST completa
- Upload de avatar
- Recuperacao de senha
- Paginas admin (arquivos existem mas imports quebram o build)
- Integracao com servicos externos (email, push notifications)
- Testes automatizados
