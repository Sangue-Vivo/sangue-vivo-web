# Changelog - Sangue Vivo

Registro de tudo que foi implementado e modificado no projeto.

---

## 2026-03-26

### Correcoes de Seguranca (Frontend Hardening)
- **Rate limiting no login**: `authStore.ts` agora bloqueia login apos 5 tentativas falhas em 15 minutos
- **Logout limpa token**: `authStore.ts` logout() agora remove `sangue-vivo-token` do localStorage
- **Senha forte no registro**: `Register.tsx` exige min 8 chars, maiuscula, numero e caractere especial (Zod)
- **Validacao de senha atual**: `Settings.tsx` agora verifica senha atual antes de permitir alteracao
- **Rota /onboarding protegida**: `App.tsx` agora envolve /onboarding em ProtectedRoute
- **Header anti-CSRF**: `api.ts` agora envia `X-Requested-With: XMLHttpRequest` em todas as requests
- **CSP meta tag**: `index.html` agora inclui Content-Security-Policy restritivo
- **Arquivos afetados**: `src/stores/authStore.ts`, `src/pages/Register.tsx`, `src/pages/Settings.tsx`, `src/App.tsx`, `src/services/api.ts`, `index.html`
- **Docs atualizados**: `docs/SEGURANCA.md`, `docs/CHANGELOG.md`

---

## 2026-03-25

### Landing Page - Redesign Completo (v2)
- **Hero split layout**: Layout dividido em 2 colunas (texto esquerda + ilustracao direita em desktop)
- **Ilustracao SVG da gota**: Gota de sangue grande central com gradientes, reflexo luminoso, aneis pulsantes e badges flutuantes (4 vidas salvas, +50 XP, 386+ doadores)
- **Gota unica caindo**: SVG de gota de sangue caindo suavemente de cima pra baixo (substituiu multiplas gotas flutuantes)
- **Secao "Por que doar?"**: Nova secao split com ilustracao circular (gota vermelha + badges orbitantes 450ml/4 vidas/~30min) e lista de beneficiados (pacientes, maes, vitimas, criancas)
- **Secao Gamificacao removida**: Removida por feedback do usuario (muito escancarada na tela inicial)
- **Stats bar**: 4 contadores animados (doacoes, vidas, doadores, universidades) em card elevado
- **Secao "Como funciona"**: Badge "SIMPLES E RAPIDO", badges numerados, icones coloridos, hover com elevacao
- **Depoimentos**: 3 testimonials de estudantes com avatar gradiente e contagem de doacoes
- **CTA Banner**: Secao pre-footer com gradiente, coracao pulsante, botao "Comecar agora", selo seguranca
- **Header**: Navegacao interna (Como funciona, Depoimentos, Hemocentros) visivel em desktop
- **Footer**: Layout horizontal com links internos
- **Badges de secao**: Badges coloridos (SIMPLES E RAPIDO, POR QUE DOAR, COMUNIDADE, REQUISITOS, PARCEIROS)

### Landing Page - Animacoes
- **Onda animada**: Substituido SVG estatico por duas ondas sobrepostas com CSS animation (8s e 12s), criando efeito de mar real
- **Botao "Criar minha conta"**: Corrigido texto invisivel (text-white sobre bg-white) — alterado para variant secondary com !text-primary
- **Requisitos "Quem pode doar"**: Adicionado animacao spring nos icones de check (rotacao + scale), hover com deslize lateral
- **Coracao do footer**: Adicionado animacao de pulsar (scale 1 → 1.3 → 1, repeat infinite)
- **Ano do footer**: Atualizado de 2024 para 2026
- **Animacoes CSS**: Adicionado keyframes `wave-drift` e classes `animate-wave` / `animate-wave-slow` em globals.css

### Sistema de Autenticacao - Reescrita Completa
- **authStore.ts**: Reescrito com suporte a registro de usuarios, array `registeredUsers`, Zustand persist
- **useAuth.ts**: Adicionado export da funcao `register`
- **Login funcional**: Agora aceita qualquer conta registrada (antes so aceitava mock hardcoded maria@ufal.edu.br)
- **Validacao de senha**: Login verifica email + senha (antes ignorava senha)
- **Mock user mantido**: maria@ufal.edu.br com senha 123456 continua funcionando

### Registro - Campo CPF e Prevencao de Duplicatas
- **Campo CPF**: Adicionado ao formulario de registro com mascara automatica (000.000.000-00)
- **Validacao de CPF**: Implementado algoritmo de digitos verificadores (rejeita CPFs invalidos e repetidos como 111.111.111-11)
- **Prevencao de duplicatas**: Erro especifico para email duplicado e CPF duplicado
- **Loading state**: Botao mostra spinner durante registro

### Faculdades de Maceio
- **Lista ampliada**: De 9 para 17 faculdades, incluindo todas as principais de Maceio
  - Publicas: UFAL, UNEAL, UNCISAL, IFAL
  - Privadas: CESMAC, UNIT, FITS, UNINASSAU, Estacio, FACIMA, FAA, SEUNE, FRM, Madre Tereza, UMJ, Anhanguera, Sao Marcos
- **Opcao "Outra"**: Quando selecionada, exibe campo de texto para digitar nome da faculdade (ex: PUC EAD)

### Breadcrumb
- **Removido breadcrumb**: Pagina de detalhe da causa nao mostra mais "Causas > Titulo da causa", apenas botao "Voltar"

### Build Fix
- **Admin imports**: Removidos imports de arquivos admin inexistentes (AdminDashboard, AdminUsers, etc.) que quebravam o build
- **Nota**: Os imports sao restaurados periodicamente pelo linter/usuario — os arquivos admin precisam ser criados

### Widget de Suporte (Gotinha Flutuante)
- **SupportWidget**: Novo componente `src/components/support/SupportWidget.tsx`
- **Botao flutuante**: Gotinha de sangue vermelha no canto inferior direito com badge "?" pulsante
- **Formulario**: Assunto (Bug/Sugestao/Duvida/Outro), descricao (textarea), email (pre-preenchido)
- **Comportamento**: Click outside fecha, toast de sucesso ao enviar, limpa campos apos envio
- **Posicionamento**: Acima do BottomNav no mobile (bottom-20), canto inferior no desktop (bottom-6)
- **Integrado** em todas as paginas protegidas via ProtectedRoute no App.tsx

### Favicon
- **Substituido**: Raio roxo do Vite por gota de sangue vermelha com gradiente e brilho branco

### .gitignore
- **Ampliado**: Adicionado .env*, coverage/, .cache/, .vite/, Thumbs.db, *.pem, *.key, *.cert, *.tsbuildinfo

### Documentacao
- **docs/PROJETO.md**: Visao geral do projeto, funcionalidades, status
- **docs/ARQUITETURA.md**: Tech stack, estrutura de pastas, rotas, fluxo de auth, gamificacao
- **docs/CHANGELOG.md**: Registro de mudancas (este arquivo)
- **docs/SEGURANCA.md**: Auditoria de seguranca com 15 vulnerabilidades
- **CLAUDE.md**: Regra para sempre atualizar docs ao criar/modificar funcionalidades

### Testes Realizados
- Registro: campos obrigatorios (10), CPF invalido, senhas diferentes, duplicata email, duplicata CPF
- Login: credenciais invalidas, email certo/senha errada, credenciais validas
- Guards: rotas protegidas sem auth, auth tenta acessar login
- Todas as 13 paginas: zero erros no console
- Auditoria de seguranca: 15 vulnerabilidades documentadas (ver SEGURANCA.md)
