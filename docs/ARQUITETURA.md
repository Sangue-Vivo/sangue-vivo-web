# Arquitetura Tecnica - Sangue Vivo

## Tech Stack

| Camada | Tecnologia | Versao |
|--------|-----------|--------|
| Framework | React | 19.2 |
| Linguagem | TypeScript | 5.9 |
| Build | Vite | 8.0 |
| Estilizacao | Tailwind CSS | 4.2 |
| Animacoes | Framer Motion | 12.38 |
| State | Zustand | 5.0 |
| Forms | React Hook Form + Zod | 7.72 / 4.3 |
| HTTP | Axios | 1.13 |
| Rotas | React Router DOM | 7.13 |
| Icones | Lucide React | 1.6 |
| Mapas | React Leaflet | 5.0 |
| Graficos | Recharts | 3.8 |
| Datas | date-fns | 4.1 |
| Toasts | React Hot Toast | 2.6 |

## Estrutura de Pastas

```
src/
├── App.tsx                    # Rotas e layout wrapper
├── main.tsx                   # Entry point React
├── types/index.ts             # Todos os tipos e enums TypeScript
├── pages/                     # Paginas (1 por rota)
│   ├── Landing.tsx            # Pagina publica inicial
│   ├── Login.tsx              # Login
│   ├── Register.tsx           # Cadastro (com CPF)
│   ├── Onboarding.tsx         # Tutorial pos-cadastro (3 steps)
│   ├── Dashboard.tsx          # Painel principal do usuario
│   ├── Causes.tsx             # Lista de causas
│   ├── CauseDetail.tsx        # Detalhe de causa + agendamento
│   ├── Profile.tsx            # Perfil do usuario
│   ├── Achievements.tsx       # Conquistas
│   ├── Ranking.tsx            # Leaderboard
│   ├── DonationHistory.tsx    # Historico de doacoes
│   ├── Education.tsx          # Conteudo educativo
│   ├── Settings.tsx           # Configuracoes
│   ├── BloodCenterMap.tsx     # Mapa de hemocentros
│   └── admin/                 # Paginas administrativas
├── components/
│   ├── ui/                    # Componentes base reutilizaveis
│   │   ├── Button.tsx         # Botao (primary, secondary, ghost, danger)
│   │   ├── Input.tsx          # Campo de input
│   │   ├── Select.tsx         # Dropdown select
│   │   ├── Card.tsx           # Card container
│   │   ├── Modal.tsx          # Modal/dialog
│   │   ├── ProgressBar.tsx    # Barra de progresso
│   │   ├── Avatar.tsx         # Avatar do usuario
│   │   ├── Badge.tsx          # Badge/tag
│   │   └── BloodTypeBadge.tsx # Badge de tipo sanguineo
│   ├── layout/                # Layout da aplicacao
│   │   ├── Header.tsx         # Barra superior
│   │   ├── Sidebar.tsx        # Navegacao lateral (desktop)
│   │   ├── BottomNav.tsx      # Navegacao inferior (mobile)
│   │   ├── Footer.tsx         # Rodape
│   │   └── PageContainer.tsx  # Wrapper de pagina
│   ├── gamification/          # Sistema de gamificacao
│   │   ├── RankProgress.tsx   # Progresso do rank
│   │   ├── Leaderboard.tsx    # Tabela de ranking
│   │   └── AchievementCard.tsx# Card de conquista
│   ├── donor/                 # Componentes do doador
│   ├── cause/                 # Componentes de causa
│   ├── donation/              # Modal de agendamento
│   ├── notification/          # Sino + lista de notificacoes
│   ├── admin/                 # Componentes admin
│   └── support/
│       └── SupportWidget.tsx  # Widget de suporte flutuante (gotinha)
├── hooks/                     # Custom hooks
│   ├── useAuth.ts             # Autenticacao
│   ├── useDonations.ts        # Gestao de doacoes
│   ├── useRanking.ts          # Dados de ranking
│   ├── useNotifications.ts    # Notificacoes
│   ├── useCauses.ts           # Causas + compatibilidade
│   ├── useAdminStats.ts       # Estatisticas admin
│   ├── useAdminUsers.ts       # Gestao de usuarios admin
│   └── useAdminCauses.ts      # Gestao de causas admin
├── stores/                    # Zustand stores
│   ├── authStore.ts           # Auth (persist localStorage)
│   ├── adminStore.ts          # Estado admin
│   └── notificationStore.ts   # Notificacoes
├── services/
│   └── api.ts                 # Axios com interceptors
├── utils/
│   ├── rankSystem.ts          # Calculos de rank e XP
│   ├── bloodTypes.ts          # Compatibilidade sanguinea
│   └── formatters.ts          # Formatacao (datas, numeros, texto)
├── mocks/                     # Dados mock (desenvolvimento)
│   ├── users.ts               # 11 usuarios mock
│   ├── causes.ts              # 6 causas mock
│   ├── achievements.ts        # 10 conquistas + progresso
│   ├── donations.ts           # 6 doacoes mock
│   ├── notifications.ts       # 8 notificacoes mock
│   └── admin.ts               # Stats e dados admin
└── styles/
    └── globals.css            # Tokens Tailwind + animacoes CSS
```

## Rotas

### Publicas
| Rota | Pagina | Descricao |
|------|--------|-----------|
| `/` | Landing | Pagina inicial |

### Auth (redireciona p/ dashboard se ja logado)
| Rota | Pagina | Descricao |
|------|--------|-----------|
| `/login` | Login | Formulario de login |
| `/register` | Register | Formulario de cadastro |
| `/onboarding` | Onboarding | Tutorial pos-cadastro |

### Protegidas (requer autenticacao)
| Rota | Pagina | Descricao |
|------|--------|-----------|
| `/dashboard` | Dashboard | Painel principal |
| `/causes` | Causes | Lista de causas |
| `/causes/:id` | CauseDetail | Detalhe + agendamento |
| `/profile` | Profile | Perfil do usuario |
| `/achievements` | Achievements | Conquistas |
| `/ranking` | Ranking | Leaderboard |
| `/donations` | DonationHistory | Historico |
| `/education` | Education | Conteudo educativo |
| `/settings` | Settings | Configuracoes |
| `/blood-centers` | BloodCenterMap | Mapa de hemocentros |

### Admin (requer auth + role admin)
| Rota | Pagina | Descricao |
|------|--------|-----------|
| `/admin` | AdminDashboard | KPIs e graficos |
| `/admin/users` | AdminUsers | Gestao de usuarios |
| `/admin/causes` | AdminCauses | Gestao de causas |
| `/admin/donations` | AdminDonations | Gestao de doacoes |
| `/admin/achievements` | AdminAchievements | Gestao de conquistas |
| `/admin/notifications` | AdminNotifications | Broadcast |
| `/admin/settings` | AdminSettings | Config do sistema |

## Fluxo de Autenticacao

```
Registro:
  Formulario (nome, email, CPF, senha, tipo sanguineo, genero, data nasc., universidade, curso)
  → Validacao Zod (CPF com digitos verificadores, email valido, senha min 6)
  → Checagem de duplicata (email + CPF)
  → Cria usuario no authStore (Zustand persist → localStorage)
  → Seta isAuthenticated = true
  → Redireciona para /onboarding

Login:
  Formulario (email, senha)
  → Busca no array registeredUsers
  → Compara email + senha
  → Seta user + isAuthenticated
  → Redireciona para /dashboard

Guards:
  ProtectedRoute → isAuthenticated? Outlet : Navigate(/login)
  AuthOnlyRoute → isAuthenticated? Navigate(/dashboard) : Outlet
  AdminRoute → role === 'admin'? AdminLayout : Navigate(/dashboard)
```

## Sistema de Gamificacao

### Ranks
| Rank | Doacoes Min | XP Min | Icone |
|------|------------|--------|-------|
| Gota | 0 | 0 | droplet |
| Bronze | 2 | 200 | medal |
| Prata | 5 | 500 | star |
| Ouro | 8 | 1000 | trophy |
| Platina | 12 | 1800 | crown |
| Diamante | 18 | 2800 | gem |
| Heroi de Sangue | 25 | 4000 | heart |

### Calculo de XP
```
Base: 100 XP por doacao
Bonus causa: +50 XP
Bonus urgencia: +30 XP
Bonus streak: +10 XP por doacao consecutiva
```

## Variaveis de Ambiente
| Variavel | Descricao | Padrao |
|----------|-----------|--------|
| `VITE_API_URL` | URL do backend API | `http://localhost:3000/api` |

## Armazenamento Local
| Chave | Conteudo |
|-------|----------|
| `sangue-vivo-auth` | Estado do Zustand (user, isAuthenticated, registeredUsers) |
| `sangue-vivo-token` | JWT token (quando backend estiver pronto) |
