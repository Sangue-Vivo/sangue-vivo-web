// Cadastro público suspenso até a adequação à LGPD; só reabre com VITE_REGISTRATION_ENABLED=true
// (a API também precisa de REGISTRATION_ENABLED=true).
export const REGISTRATION_ENABLED = import.meta.env.VITE_REGISTRATION_ENABLED === 'true';
