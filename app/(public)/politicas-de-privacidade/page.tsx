import Link from 'next/link'
import { Shield, Lock, FileText, Users, Database, Server } from 'lucide-react'

export default function PrivacyPoliciesPage() {
  const lastUpdated = '20 de março de 2025'

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Política de Privacidade
        </h1>
        <p className="text-muted-foreground">
          Última atualização: {lastUpdated}
        </p>
      </div>

      {/* Índice de navegação */}
      <div className="mb-10 p-6 bg-muted/30 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Índice
        </h2>
        <nav className="grid gap-2">
          {[
            { id: 'introducao', label: 'Introdução' },
            { id: 'dados-coletados', label: 'Dados Coletados' },
            { id: 'uso-informacoes', label: 'Uso das Informações' },
            { id: 'compartilhamento', label: 'Compartilhamento de Dados' },
            { id: 'seguranca', label: 'Segurança e Armazenamento' },
            { id: 'direitos', label: 'Direitos do Usuário' },
            { id: 'cookies', label: 'Cookies e Tecnologias Semelhantes' },
            { id: 'menores', label: 'Menores de Idade' },
            { id: 'alteracoes', label: 'Alterações na Política' },
            { id: 'contato', label: 'Contato' },
          ].map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className="text-primary hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Introdução */}
      <section id="introducao" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <Shield className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Introdução</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Bem-vindo à Política de Privacidade da nossa plataforma. Este
            documento foi elaborado para explicar de forma clara e transparente
            como coletamos, usamos, compartilhamos e protegemos suas informações
            pessoais.
          </p>
          <p>
            Estamos comprometidos com a proteção da sua privacidade e com o
            cumprimento das leis de proteção de dados aplicáveis, incluindo a
            Lei Geral de Proteção de Dados (LGPD) no Brasil e o Regulamento
            Geral sobre a Proteção de Dados (GDPR) na União Europeia.
          </p>
          <p>
            Ao utilizar nossa plataforma, você concorda com as práticas
            descritas nesta Política de Privacidade. Recomendamos a leitura
            completa deste documento para entender como tratamos seus dados
            pessoais.
          </p>
        </div>
      </section>

      {/* Dados Coletados */}
      <section id="dados-coletados" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <Database className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Dados Coletados</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Para fornecer nossos serviços, coletamos diferentes tipos de
            informações pessoais. Abaixo, detalhamos quais dados são coletados e
            como isso ocorre:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Informações fornecidas por você
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium text-foreground">
                Dados de cadastro:
              </span>{' '}
              Nome completo, endereço de e-mail, número de telefone/WhatsApp,
              CPF/CNPJ e senha.
            </li>
            <li>
              <span className="font-medium text-foreground">Endereços:</span>{' '}
              CEP, rua, número, complemento, bairro, cidade e estado para
              entrega de pedidos ou localização do estabelecimento.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Dados de pagamento:
              </span>{' '}
              Informações necessárias para processar pagamentos, como método de
              pagamento escolhido (PIX, cartão de crédito/débito, voucher de
              refeição ou dinheiro).
            </li>
            <li>
              <span className="font-medium text-foreground">
                Informações de estabelecimentos:
              </span>{' '}
              Se você é um proprietário de estabelecimento, coletamos dados
              adicionais como nome do estabelecimento, descrição, horários de
              funcionamento e informações fiscais.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Informações geradas pelo uso da plataforma
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium text-foreground">
                Histórico de pedidos:
              </span>{' '}
              Itens pedidos, valores, data e hora, método de pagamento, endereço
              de entrega e status do pedido.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Avaliações e comentários:
              </span>{' '}
              Avaliações de produtos, notas atribuídas e comentários realizados.
            </li>
            <li>
              <span className="font-medium text-foreground">Dados de uso:</span>{' '}
              Informações sobre como você interage com nossa plataforma,
              incluindo páginas visitadas, tempo de permanência, horários de
              acesso e funcionalidades utilizadas.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Dados do dispositivo:
              </span>{' '}
              Tipo de dispositivo, sistema operacional, navegador, endereço IP e
              identificadores de dispositivo.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Dados de localização:
              </span>{' '}
              Informações de geolocalização para facilitar a entrega de pedidos
              e exibir estabelecimentos próximos.
            </li>
          </ul>
        </div>
      </section>

      {/* Uso das Informações */}
      <section id="uso-informacoes" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Uso das Informações</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Utilizamos suas informações pessoais para os seguintes propósitos:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium text-foreground">
                Fornecimento dos serviços:
              </span>{' '}
              Processar pedidos, facilitar pagamentos, coordenar entregas e
              permitir a comunicação entre clientes e estabelecimentos.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Gerenciamento de contas:
              </span>{' '}
              Criar e administrar sua conta, autenticar seu acesso e manter seus
              dados atualizados.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Personalização da experiência:
              </span>{' '}
              Oferecer recomendações personalizadas, lembrar suas preferências e
              adaptar o conteúdo às suas necessidades.
            </li>
            <li>
              <span className="font-medium text-foreground">Comunicações:</span>{' '}
              Enviar notificações sobre pedidos, atualizações de status,
              confirmações de pagamento e informações importantes sobre sua
              conta.
            </li>
            <li>
              <span className="font-medium text-foreground">Marketing:</span>{' '}
              Enviar comunicações promocionais, ofertas especiais e novidades
              sobre nossos serviços, sempre respeitando suas preferências de
              comunicação.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Melhoria dos serviços:
              </span>{' '}
              Analisar como nossa plataforma é utilizada para aprimorar
              funcionalidades, corrigir problemas e desenvolver novos recursos.
            </li>
            <li>
              <span className="font-medium text-foreground">Segurança:</span>{' '}
              Proteger nossa plataforma, detectar e prevenir atividades
              fraudulentas, abusos e violações de segurança.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Cumprimento legal:
              </span>{' '}
              Cumprir obrigações legais, regulatórias e fiscais aplicáveis ao
              nosso negócio.
            </li>
          </ul>
        </div>
      </section>

      {/* Compartilhamento de Dados */}
      <section id="compartilhamento" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <Server className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Compartilhamento de Dados</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Podemos compartilhar suas informações pessoais com as seguintes
            categorias de destinatários:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium text-foreground">
                Estabelecimentos parceiros:
              </span>{' '}
              Compartilhamos dados necessários para o processamento e entrega de
              pedidos, como nome, endereço de entrega, itens pedidos e
              informações de contato.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Processadores de pagamento:
              </span>{' '}
              Compartilhamos informações necessárias para processar transações
              financeiras com nossos parceiros de pagamento.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Prestadores de serviços:
              </span>{' '}
              Empresas que nos auxiliam na operação da plataforma, como serviços
              de hospedagem, análise de dados, atendimento ao cliente e
              marketing.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Autoridades competentes:
              </span>{' '}
              Quando exigido por lei, ordem judicial ou para proteger direitos,
              propriedade ou segurança.
            </li>
          </ul>

          <p className="mt-4">
            Não vendemos suas informações pessoais a terceiros. Quando
            compartilhamos dados com parceiros e prestadores de serviços,
            estabelecemos contratos que exigem a proteção adequada de suas
            informações.
          </p>
        </div>
      </section>

      {/* Segurança e Armazenamento */}
      <section id="seguranca" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <Lock className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Segurança e Armazenamento</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Implementamos medidas técnicas e organizacionais apropriadas para
            proteger suas informações pessoais contra acesso não autorizado,
            perda, alteração ou divulgação indevida:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium text-foreground">Criptografia:</span>{' '}
              Utilizamos criptografia para proteger dados sensíveis durante a
              transmissão e armazenamento.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Controles de acesso:
              </span>{' '}
              Restringimos o acesso às informações pessoais apenas a
              funcionários e parceiros que precisam conhecê-las para fornecer os
              serviços.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Monitoramento:
              </span>{' '}
              Realizamos monitoramento contínuo de nossos sistemas para detectar
              e prevenir vulnerabilidades e ameaças.
            </li>
            <li>
              <span className="font-medium text-foreground">Autenticação:</span>{' '}
              Implementamos mecanismos de autenticação seguros, incluindo opção
              de autenticação de dois fatores.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Período de retenção
          </h3>
          <p>
            Mantemos suas informações pessoais pelo tempo necessário para
            cumprir as finalidades descritas nesta Política de Privacidade, a
            menos que um período de retenção mais longo seja exigido ou
            permitido por lei. Os critérios utilizados para determinar nossos
            períodos de retenção incluem:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              O período durante o qual temos um relacionamento ativo com você
              (enquanto sua conta estiver ativa);
            </li>
            <li>
              Obrigações legais às quais estamos sujeitos (como requisitos
              fiscais e contábeis);
            </li>
            <li>
              Prazos de prescrição aplicáveis para possíveis reclamações ou
              disputas.
            </li>
          </ul>
        </div>
      </section>

      {/* Direitos do Usuário */}
      <section id="direitos" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Direitos do Usuário</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            De acordo com as leis de proteção de dados aplicáveis, você possui
            os seguintes direitos em relação às suas informações pessoais:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium text-foreground">
                Direito de acesso:
              </span>{' '}
              Você pode solicitar uma cópia das informações pessoais que
              mantemos sobre você.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Direito de retificação:
              </span>{' '}
              Você pode solicitar a correção de informações pessoais imprecisas
              ou incompletas.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Direito de exclusão:
              </span>{' '}
              Em determinadas circunstâncias, você pode solicitar a exclusão de
              suas informações pessoais.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Direito de restrição:
              </span>{' '}
              Você pode solicitar a limitação do processamento de suas
              informações pessoais em determinadas circunstâncias.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Direito de portabilidade:
              </span>{' '}
              Você pode solicitar a transferência de suas informações pessoais
              para outro provedor de serviços em formato estruturado.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Direito de oposição:
              </span>{' '}
              Você pode se opor ao processamento de suas informações pessoais em
              determinadas circunstâncias, especialmente para marketing direto.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Direito de retirar o consentimento:
              </span>{' '}
              Quando o processamento é baseado no seu consentimento, você pode
              retirá-lo a qualquer momento.
            </li>
          </ul>

          <p className="mt-4">
            Para exercer qualquer um desses direitos, entre em contato conosco
            através dos canais indicados na seção "Contato" desta política.
            Responderemos à sua solicitação dentro do prazo estabelecido pela
            legislação aplicável.
          </p>
        </div>
      </section>

      {/* Cookies e Tecnologias Semelhantes */}
      <section id="cookies" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <Database className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">
            Cookies e Tecnologias Semelhantes
          </h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Utilizamos cookies e tecnologias semelhantes para melhorar sua
            experiência em nossa plataforma, entender como ela é utilizada e
            personalizar nosso conteúdo.
          </p>

          <p>
            Os cookies são pequenos arquivos de texto armazenados em seu
            dispositivo quando você visita nosso site. Eles nos permitem
            reconhecer seu dispositivo e lembrar suas preferências.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Tipos de cookies que utilizamos:
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium text-foreground">
                Cookies essenciais:
              </span>{' '}
              Necessários para o funcionamento básico da plataforma, como
              autenticação e segurança.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Cookies de preferências:
              </span>{' '}
              Permitem que a plataforma lembre suas escolhas e preferências.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Cookies analíticos:
              </span>{' '}
              Ajudam-nos a entender como os usuários interagem com nossa
              plataforma, permitindo melhorias contínuas.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Cookies de marketing:
              </span>{' '}
              Utilizados para exibir anúncios relevantes e medir a eficácia de
              campanhas publicitárias.
            </li>
          </ul>

          <p className="mt-4">
            Você pode gerenciar suas preferências de cookies através das
            configurações do seu navegador. No entanto, desabilitar certos
            cookies pode afetar a funcionalidade da plataforma.
          </p>
        </div>
      </section>

      {/* Menores de Idade */}
      <section id="menores" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Menores de Idade</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Nossa plataforma não é direcionada a menores de 18 anos. Não
            coletamos intencionalmente informações pessoais de menores de idade.
            Se você é pai, mãe ou responsável legal e acredita que seu filho nos
            forneceu informações pessoais, entre em contato conosco
            imediatamente para que possamos tomar as medidas apropriadas.
          </p>
        </div>
      </section>

      {/* Alterações na Política */}
      <section id="alteracoes" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <FileText className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Alterações na Política</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente para
            refletir mudanças em nossas práticas de privacidade, alterações
            legais ou melhorias em nossa plataforma. A versão mais recente será
            sempre publicada em nosso site com a data da última atualização.
          </p>
          <p>
            Quando fizermos alterações significativas, notificaremos você
            através de um aviso em nossa plataforma ou por e-mail, conforme
            exigido por lei. Recomendamos que você revise esta política
            regularmente para se manter informado sobre como protegemos suas
            informações.
          </p>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Contato</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Se você tiver dúvidas, preocupações ou solicitações relacionadas a
            esta Política de Privacidade ou ao tratamento de suas informações
            pessoais, entre em contato com nosso Encarregado de Proteção de
            Dados (DPO):
          </p>

          <div className="bg-muted/30 p-4 rounded-lg mt-4">
            <p>
              <strong>E-mail:</strong> contato@vendemtudo.com.br
            </p>
            <p>
              <strong>Telefone:</strong> (00) 0 0000-0000
            </p>
            <p>
              <strong>Endereço:</strong> Av. Principal, 1000 - Centro, Cidade -
              Estado, CEP 00000-000
            </p>
          </div>

          <p className="mt-4">
            Responderemos à sua solicitação dentro do prazo estabelecido pela
            legislação aplicável.
          </p>
        </div>
      </section>
    </div>
  )
}
