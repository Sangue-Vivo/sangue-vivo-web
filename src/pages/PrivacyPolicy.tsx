import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Droplets } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-warm py-10 px-4">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-dark">Política de Privacidade</h1>
          </div>
          <p className="text-sm text-gray-500">Última atualização: 26 de março de 2026</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-dark mb-3">1. Introdução</h2>
            <p>
              A plataforma <strong>Sangue Vivo</strong> é um projeto universitário desenvolvido com o
              objetivo de incentivar a doação de sangue entre estudantes universitários do estado de
              Alagoas. Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos
              e protegemos seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados
              Pessoais (Lei nº 13.709/2018 — LGPD).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">2. Dados Coletados</h2>
            <p className="mb-2">Coletamos os seguintes dados pessoais durante o cadastro e uso da plataforma:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Dados de identificação:</strong> nome completo, CPF, data de nascimento, gênero</li>
              <li><strong>Dados de contato:</strong> endereço de e-mail</li>
              <li><strong>Dados de saúde:</strong> tipo sanguíneo</li>
              <li><strong>Dados acadêmicos:</strong> universidade e curso</li>
              <li><strong>Dados de uso:</strong> histórico de doações e interações com a plataforma</li>
              <li><strong>Dados técnicos:</strong> cookies e informações de navegação</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">3. Finalidade do Tratamento</h2>
            <p className="mb-2">Seus dados pessoais são tratados para as seguintes finalidades:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Criação e gerenciamento da sua conta na plataforma</li>
              <li>Registro e acompanhamento do histórico de doações de sangue</li>
              <li>Alertas de estoque e notificações de elegibilidade para incentivar doações</li>
              <li>Comunicação sobre campanhas de doação e causas urgentes</li>
              <li>Compatibilidade sanguínea para direcionamento de campanhas</li>
              <li>Melhoria contínua da plataforma e experiência do usuário</li>
              <li>Cumprimento de obrigações legais e regulatórias</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">4. Base Legal (LGPD — Art. 7º)</h2>
            <p className="mb-2">O tratamento dos seus dados pessoais é realizado com base nas seguintes hipóteses legais previstas no Art. 7º da LGPD:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Consentimento do titular (Art. 7º, I):</strong> para coleta e uso dos dados
                pessoais e de saúde, mediante aceite expresso no momento do cadastro.
              </li>
              <li>
                <strong>Execução de contrato (Art. 7º, V):</strong> para viabilizar o uso dos
                serviços oferecidos pela plataforma.
              </li>
              <li>
                <strong>Interesse legítimo (Art. 7º, IX):</strong> para melhoria da plataforma e
                comunicações relevantes sobre doação de sangue.
              </li>
              <li>
                <strong>Proteção da vida ou da incolumidade física (Art. 7º, VII):</strong> em
                situações de campanhas urgentes de doação de sangue.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">5. Compartilhamento de Dados</h2>
            <p className="mb-2">
              Seus dados pessoais <strong>não são compartilhados</strong> com terceiros para fins
              comerciais. O compartilhamento poderá ocorrer apenas nas seguintes situações:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Com hemocentros parceiros, para fins de agendamento e registro de doações</li>
              <li>Com autoridades competentes, quando exigido por lei ou ordem judicial</li>
              <li>Com provedores de infraestrutura tecnológica, sob contrato de confidencialidade</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">6. Direitos do Titular</h2>
            <p className="mb-2">
              Em conformidade com a LGPD, você possui os seguintes direitos sobre seus dados pessoais:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Confirmação da existência de tratamento de dados</li>
              <li>Acesso aos seus dados pessoais</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
              <li>Portabilidade dos dados a outro fornecedor de serviço</li>
              <li>Eliminação dos dados tratados com consentimento</li>
              <li>Informação sobre compartilhamento de dados</li>
              <li>Revogação do consentimento a qualquer momento</li>
            </ul>
            <p className="mt-2">
              Para exercer seus direitos, entre em contato conosco através do e-mail indicado na seção de contato abaixo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">7. Armazenamento e Segurança</h2>
            <p>
              Seus dados são armazenados em servidores seguros e protegidos por medidas técnicas e
              organizacionais adequadas para prevenir acessos não autorizados, situações acidentais
              ou ilícitas de destruição, perda, alteração ou comunicação. Como projeto universitário,
              utilizamos as melhores práticas de segurança disponíveis para garantir a proteção dos
              seus dados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">8. Cookies</h2>
            <p>
              Utilizamos cookies para melhorar sua experiência de navegação, manter sua sessão ativa
              e coletar informações sobre o uso da plataforma. Você pode gerenciar suas preferências
              de cookies a qualquer momento através das configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">9. Contato do Encarregado (DPO)</h2>
            <p className="mb-2">
              Para dúvidas, solicitações ou exercício dos seus direitos previstos na LGPD, entre em
              contato com nosso Encarregado de Proteção de Dados:
            </p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <p><strong>Encarregado (DPO):</strong> Equipe Sangue Vivo</p>
              <p><strong>E-mail:</strong> privacidade@sanguevivo.com.br</p>
              <p><strong>Instituição:</strong> Projeto Universitário — Alagoas</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">10. Alterações nesta Política</h2>
            <p>
              Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças
              nas nossas práticas ou na legislação aplicável. Recomendamos que você revise esta
              página regularmente. A data da última atualização será sempre indicada no topo deste
              documento.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
