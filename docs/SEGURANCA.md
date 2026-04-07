# Auditoria de Seguranca - Sangue Vivo

Ultima auditoria: 2026-03-26

## Resumo

| Severidade | Qtd | Status |
|-----------|-----|--------|
| Critico | 1 | Parcialmente resolvido |
| Alto | 3 | 1 resolvido, 2 pendentes |
| Medio | 7 | 6 resolvidos/parciais, 1 pendente |
| Baixo | 4 | Pendentes |

**Nota**: Com a implementacao do backend (Express + PostgreSQL + JWT + bcrypt), varias vulnerabilidades criticas foram resolvidas. O frontend ainda mantem um authStore mock com senhas em plaintext como fallback — deve ser removido antes do deploy.

---

## CRITICO

### 1. Senhas em texto plano no localStorage (frontend mock)
- **Arquivo**: `src/stores/authStore.ts`
- **Problema**: O authStore do Zustand ainda armazena `registeredUsers` com senhas em plaintext no localStorage. Isso e um remanescente do modo mock (antes do backend).
- **Status**: PARCIALMENTE RESOLVIDO — O backend (`sangue-vivo-api`) ja usa bcrypt para hash de senhas e JWT para autenticacao. Porem o frontend ainda mantem o store mock ativo como fallback.
- **Fix pendente**: Remover completamente o `registeredUsers` e a logica de auth mock do `authStore.ts`. O frontend deve usar exclusivamente a API para autenticacao.

---

## ALTO

### 2. Credenciais hardcoded no codigo
- **Arquivos**: `src/stores/authStore.ts` (mock admin), `sangue-vivo-api/src/database/seeders/seed.ts`
- **Problema**: Senhas de seed (`123456`, `admin123`) e mock admin visíveis no source code
- **Status**: PENDENTE — aceitavel para desenvolvimento, mas deve ser removido antes do deploy
- **Fix**: Remover credenciais hardcoded. Usar variaveis de ambiente para admin seed. Nunca incluir seeders no bundle de producao

### 3. Dados sensiveis nos mocks (CPFs, telefones)
- **Arquivo**: `src/mocks/users.ts`, `sangue-vivo-api/src/database/seeders/seed.ts`
- **Problema**: CPFs e dados pessoais no bundle de producao
- **Status**: PENDENTE
- **Fix**: Mover mocks para dev-only. Usar dados obviamente fakes. Excluir seeders do build de producao

### 4. Enumeracao de contas via mensagens de erro
- **Arquivo**: `sangue-vivo-api/src/modules/auth/auth.service.ts`
- **Problema**: `register()` diferencia "Ja existe conta com este e-mail" de "Ja existe conta com este CPF", revelando quais dados existem no sistema
- **Status**: RESOLVIDO PARCIALMENTE — `login()` ja usa mensagem generica ("Credenciais invalidas"). `register()` ainda diferencia.
- **Fix**: Usar mensagem generica no register: "Nao foi possivel criar a conta. Verifique os dados informados"

---

## MEDIO

### 5. Senha fraca aceita (min 6 chars, sem complexidade)
- **Arquivo**: `src/pages/Register.tsx`
- **Status**: RESOLVIDO (frontend) — Zod agora exige min 8 chars, maiuscula, numero, caractere especial
- **Fix pendente**: Validar no backend tambem (mesmas regras)

### 6. Sem rate limiting no login
- **Problema**: Tentativas ilimitadas de login na API
- **Status**: RESOLVIDO (frontend) — authStore bloqueia apos 5 tentativas por 15min
- **Fix pendente**: Adicionar express-rate-limit no backend tambem

### 7. Expiracao de sessao longa
- **Arquivo**: `sangue-vivo-api/src/config/env.ts`
- **Problema**: JWT expira em 7 dias (`JWT_EXPIRES_IN: '7d'`). Nao ha refresh token.
- **Status**: RESOLVIDO PARCIALMENTE — JWT tem expiracao, mas 7d e excessivo para app com dados de saude
- **Fix**: Reduzir para 1h-2h com refresh token rotativo

### 8. Sem protecao CSRF
- **Problema**: Formularios sem token anti-CSRF
- **Status**: PARCIALMENTE RESOLVIDO — Header `X-Requested-With: XMLHttpRequest` adicionado em todas as requests (api.ts). Backend usa CORS com origin restrito
- **Fix pendente**: Implementar CSRF tokens ou usar SameSite cookies para protecao completa

### 9. Validacao de CPF no backend
- **Status**: RESOLVIDO — backend valida dados ao registrar/atualizar usuarios via Sequelize models

### 10. Sem Content Security Policy / Helmet
- **Status**: PARCIALMENTE RESOLVIDO — CSP meta tag adicionada em `index.html` (frontend)
- **Fix pendente**: Instalar e configurar `helmet` no Express para CSP via headers do servidor

### 11. Sanitizacao de input
- **Status**: RESOLVIDO PARCIALMENTE — React escapa XSS no frontend. Backend usa Sequelize (parametrizado, previne SQL injection). Porem nao ha sanitizacao explicita de HTML em campos de texto livre
- **Fix**: Adicionar validacao/sanitizacao com zod ou express-validator no backend

---

## BAIXO

### 12. HTTPS nao enforced
- **Status**: PENDENTE
- **Fix**: Usar HTTPS em producao + header HSTS via helmet

### 13. Sem scan de dependencias
- **Status**: PENDENTE
- **Fix**: Integrar `npm audit` no CI/CD

### 14. Sem audit logging
- **Status**: PENDENTE
- **Fix**: Logar acessos a dados sensiveis, tentativas de login, e acoes admin no backend

### 15. JWT Secret fraco em dev
- **Arquivo**: `sangue-vivo-api/src/config/env.ts`
- **Problema**: Fallback `'dev-secret'` como JWT_SECRET. Se `.env` nao for configurado em producao, tokens serao facilmente forjaveis
- **Fix**: Exigir JWT_SECRET em producao (sem fallback). Usar secret com min 256 bits

---

## O que ja foi implementado (backend)

- Senhas com hash bcrypt (cost 10)
- Autenticacao via JWT com expiracao
- Middleware de autenticacao (`auth.ts`) que verifica token em rotas protegidas
- Login com mensagens genericas ("Credenciais invalidas")
- CORS configurado com origin restrito
- Sequelize parametrizado (previne SQL injection)
- Reset de senha com token hasheado (SHA-256) e expiracao de 1h
- Roles (user/admin) com controle de acesso

---

## Checklist para Deploy em Producao

- [x] Implementar backend com autenticacao real (bcrypt + JWT)
- [ ] Remover authStore mock e credenciais hardcoded do frontend
- [ ] Remover mocks e seeders do bundle de producao
- [ ] Adicionar rate limiting (express-rate-limit)
- [ ] Configurar HTTPS + HSTS
- [ ] Instalar e configurar helmet (CSP, X-Frame-Options, etc.)
- [ ] Reduzir JWT expiracao (1-2h) + implementar refresh token
- [ ] Adicionar CSRF protection
- [ ] Exigir JWT_SECRET forte em producao (sem fallback)
- [ ] Validar/sanitizar inputs no backend (zod ou express-validator)
- [ ] Rodar `npm audit` e corrigir vulnerabilidades
- [ ] Usar mensagens de erro genericas no register
- [ ] Implementar audit logging
- [x] Exigir senha forte (min 8 chars, complexidade) — frontend implementado
