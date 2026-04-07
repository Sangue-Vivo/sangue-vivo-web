import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Droplets } from 'lucide-react';

export default function TermsOfUse() {
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
            <h1 className="text-3xl font-bold text-dark">Termos de Uso</h1>
          </div>
          <p className="text-sm text-gray-500">Última atualização: 26 de março de 2026</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-dark mb-3">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar a plataforma <strong>Sangue Vivo</strong>, você concorda
              integralmente com estes Termos de Uso. Caso não concorde com alguma disposição, por
              favor, não utilize a plataforma. O uso continuado após alterações nestes termos
              constitui aceitação das modificações.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">2. Descrição do Serviço</h2>
            <p>
              O Sangue Vivo é uma plataforma universitária que tem como objetivo
              incentivar a doação de sangue entre estudantes universitários do estado de Alagoas. A
              plataforma oferece funcionalidades como registro de doações, alertas de estoque dos
              hemocentros, localização de hemocentros e conteúdo educativo sobre doação de
              sangue.
            </p>
            <p className="mt-2">
              <strong>Importante:</strong> Esta plataforma é um projeto universitário e não
              substitui orientação médica profissional. Sempre consulte um profissional de saúde
              antes de realizar uma doação de sangue.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">3. Cadastro</h2>
            <p className="mb-2">Para utilizar a plataforma, você deverá criar uma conta fornecendo informações verdadeiras e atualizadas. Ao se cadastrar, você declara que:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Possui pelo menos 16 anos de idade</li>
              <li>As informações fornecidas são verdadeiras, completas e atualizadas</li>
              <li>É responsável por manter a confidencialidade da sua senha</li>
              <li>Notificará imediatamente sobre qualquer uso não autorizado da sua conta</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">4. Responsabilidades do Usuário</h2>
            <p className="mb-2">Ao utilizar a plataforma, o usuário se compromete a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Utilizar a plataforma de acordo com a legislação vigente e estes Termos</li>
              <li>Não fornecer informações falsas ou enganosas</li>
              <li>Não utilizar a plataforma para fins ilícitos ou não autorizados</li>
              <li>Não tentar acessar áreas restritas da plataforma sem autorização</li>
              <li>Não interferir no funcionamento normal da plataforma</li>
              <li>Respeitar os demais usuários e manter conduta adequada</li>
              <li>Manter seus dados cadastrais atualizados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">5. Proteção de Dados</h2>
            <p>
              O tratamento dos seus dados pessoais é regido pela nossa{' '}
              <Link to="/privacy" className="text-primary font-semibold hover:underline">
                Política de Privacidade
              </Link>
              , que descreve em detalhe como coletamos, utilizamos, armazenamos e protegemos seus
              dados, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº
              13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">6. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo da plataforma Sangue Vivo, incluindo mas não limitado a textos,
              gráficos, logotipos, ícones, imagens, código-fonte e software, é protegido por
              direitos de propriedade intelectual. É proibida a reprodução, distribuição ou
              modificação do conteúdo sem autorização prévia e por escrito.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">7. Alertas e Notificações</h2>
            <p>
              A plataforma utiliza alertas de estoque dos hemocentros e notificações de elegibilidade
              para informar os doadores sobre a situação dos bancos de sangue e quando podem
              realizar uma nova doação. Essas informações são baseadas em dados dos hemocentros
              parceiros e nos intervalos legais de doação.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">8. Limitação de Responsabilidade</h2>
            <p className="mb-2">A plataforma Sangue Vivo:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Não presta serviços médicos</strong> e não substitui consultas ou
                orientações de profissionais de saúde
              </li>
              <li>
                <strong>Não garante disponibilidade ininterrupta</strong> do serviço, podendo
                ocorrer manutenções programadas ou não
              </li>
              <li>
                <strong>Não se responsabiliza</strong> por decisões médicas tomadas com base nas
                informações da plataforma
              </li>
              <li>
                <strong>Não se responsabiliza</strong> por danos indiretos, incidentais ou
                consequentes decorrentes do uso da plataforma
              </li>
              <li>
                <strong>Sendo um projeto universitário</strong>, pode ser descontinuado ou
                modificado substancialmente sem aviso prévio
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">9. Modificações nos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As
              alterações entrarão em vigor imediatamente após a publicação na plataforma. O uso
              continuado da plataforma após a publicação das alterações constitui aceitação dos novos
              termos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">10. Disposições Gerais</h2>
            <p>
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer
              controvérsia decorrente destes termos será submetida ao foro da Comarca de Maceió,
              estado de Alagoas, com exclusão de qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3">11. Contato</h2>
            <p className="mb-2">
              Em caso de dúvidas sobre estes Termos de Uso, entre em contato conosco:
            </p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <p><strong>E-mail:</strong> contato@sanguevivo.com.br</p>
              <p><strong>Plataforma:</strong> Sangue Vivo — Projeto Universitário</p>
              <p><strong>Localização:</strong> Maceió, Alagoas — Brasil</p>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
