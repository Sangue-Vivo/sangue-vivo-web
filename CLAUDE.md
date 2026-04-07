# Sangue Vivo - Instrucoes para Claude

## Sobre o Projeto
Plataforma web gamificada de doacao de sangue para estudantes universitarios de Alagoas.
Tech stack: React 19, TypeScript, Tailwind CSS 4, Zustand, Vite 8, Framer Motion.

## Regra de Documentacao

**OBRIGATORIO**: Sempre que criar, modificar ou remover funcionalidades, atualizar a documentacao em `docs/`:

1. **docs/CHANGELOG.md** - Adicionar entrada com data, descricao do que foi feito, e arquivos afetados
2. **docs/PROJETO.md** - Atualizar se houver mudanca nas funcionalidades principais ou status do projeto
3. **docs/ARQUITETURA.md** - Atualizar se houver novos arquivos, rotas, componentes, hooks, stores ou mudancas estruturais
4. **docs/SEGURANCA.md** - Atualizar se houver mudancas de seguranca, novas vulnerabilidades ou correcoes

### Quando atualizar cada doc:
- Novo componente/pagina → ARQUITETURA.md + CHANGELOG.md
- Nova funcionalidade → PROJETO.md + CHANGELOG.md
- Bug fix → CHANGELOG.md
- Mudanca de rota → ARQUITETURA.md + CHANGELOG.md
- Correcao de seguranca → SEGURANCA.md + CHANGELOG.md
- Refatoracao → CHANGELOG.md + ARQUITETURA.md (se estrutura mudar)

## Convencoes do Projeto

- Idioma do codigo: Ingles (nomes de variaveis, componentes, tipos)
- Idioma da UI: Portugues brasileiro
- Componentes UI base ficam em `src/components/ui/`
- Cada pagina corresponde a uma rota em `src/pages/`
- State management via Zustand (stores em `src/stores/`)
- Validacao de formularios com Zod + React Hook Form
- Animacoes com Framer Motion
- Dados mock em `src/mocks/` (sera substituido por backend)

## Problemas Conhecidos

- Imports de admin em App.tsx referenciam arquivos que nao existem ainda (`src/pages/admin/`, `src/components/admin/AdminLayout.tsx`). Esses imports sao restaurados pelo linter. Os arquivos admin precisam ser criados para o build funcionar.
- Sistema de autenticacao e 100% frontend (mock). Senhas em plaintext no localStorage. Requer backend para producao.

## Testes

Ao fazer mudancas, verificar:
1. Build sem erros (`npm run build` ou checar Vite console)
2. Todas as paginas renderizam sem erros no console
3. Fluxo de registro → login → dashboard funciona
4. Guards de rota funcionam (sem auth → /login, com auth → redireciona de /login)
