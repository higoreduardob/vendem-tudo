import Link from 'next/link'
import {
  FileText,
  Scale,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  MessageSquare,
  Store,
  User,
} from 'lucide-react'

import { Container } from '@/components/container'

export default function TermsOfServicePage() {
  const lastUpdated = '20 de março de 2025'

  return (
    <Container className="pt-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Termos de Uso</h1>
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
            { id: 'definicoes', label: 'Definições' },
            { id: 'cadastro', label: 'Cadastro e Conta' },
            { id: 'servicos', label: 'Serviços Oferecidos' },
            { id: 'estabelecimentos', label: 'Regras para Estabelecimentos' },
            { id: 'clientes', label: 'Regras para Clientes' },
            { id: 'pagamentos', label: 'Pagamentos e Taxas' },
            { id: 'propriedade', label: 'Propriedade Intelectual' },
            { id: 'responsabilidades', label: 'Limitação de Responsabilidade' },
            { id: 'proibicoes', label: 'Condutas Proibidas' },
            { id: 'cancelamento', label: 'Cancelamento e Suspensão' },
            { id: 'alteracoes', label: 'Alterações nos Termos' },
            { id: 'legislacao', label: 'Legislação Aplicável' },
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
          <BookOpen className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Introdução</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Bem-vindo aos Termos de Uso da nossa plataforma. Este documento
            estabelece as regras e condições para utilização de nossos serviços,
            tanto para clientes quanto para estabelecimentos parceiros.
          </p>
          <p>
            Ao acessar ou utilizar nossa plataforma, você concorda expressamente
            com estes Termos de Uso. Se você não concordar com qualquer
            disposição destes termos, solicitamos que não utilize nossos
            serviços.
          </p>
          <p>
            Recomendamos a leitura completa e cuidadosa deste documento, bem
            como de nossa Política de Privacidade, que é parte integrante destes
            Termos de Uso.
          </p>
        </div>
      </section>

      {/* Definições */}
      <section id="definicoes" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <FileText className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Definições</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Para melhor compreensão destes Termos de Uso, os termos abaixo terão
            os seguintes significados:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium text-foreground">
                &quot;Plataforma&quot;:
              </span>{' '}
              Refere-se ao site, aplicativo móvel e sistemas relacionados que
              compõem nossos serviços.
            </li>
            <li>
              <span className="font-medium text-foreground">
                &quot;Usuário&quot;:
              </span>{' '}
              Qualquer pessoa que acesse ou utilize nossa plataforma, incluindo
              clientes e representantes de estabelecimentos.
            </li>
            <li>
              <span className="font-medium text-foreground">
                &quot;Cliente&quot;:
              </span>{' '}
              Usuário que utiliza a plataforma para realizar pedidos e compras.
            </li>
            <li>
              <span className="font-medium text-foreground">
                &quot;Estabelecimento&quot;:
              </span>{' '}
              Restaurantes, lanchonetes e outros negócios que oferecem seus
              produtos através da plataforma.
            </li>
            <li>
              <span className="font-medium text-foreground">
                &quot;Pedido&quot;:
              </span>{' '}
              Solicitação de produtos realizada pelo cliente através da
              plataforma.
            </li>
            <li>
              <span className="font-medium text-foreground">
                &quot;Conteúdo&quot;:
              </span>{' '}
              Textos, imagens, vídeos, logotipos, marcas, descrições de produtos
              e qualquer outro material disponibilizado na plataforma.
            </li>
          </ul>
        </div>
      </section>

      {/* Cadastro e Conta */}
      <section id="cadastro" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <User className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Cadastro e Conta</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Requisitos para cadastro
          </h3>
          <p>Para utilizar nossa plataforma, você deve:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Ter pelo menos 18 anos de idade ou a maioridade legal em sua
              jurisdição. No entanto, menores de idade podem utilizar a
              plataforma se tiverem autorização e supervisão dos responsáveis
              legais.;
            </li>
            <li>
              Fornecer informações precisas, completas e atualizadas durante o
              processo de cadastro;
            </li>
            <li>
              Manter a confidencialidade de sua senha e não compartilhá-la com
              terceiros;
            </li>
            <li>
              Ser responsável por todas as atividades que ocorram em sua conta;
            </li>
            <li>
              Notificar-nos imediatamente sobre qualquer uso não autorizado de
              sua conta.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Tipos de contas
          </h3>
          <p>
            Nossa plataforma oferece diferentes tipos de contas, cada uma com
            funcionalidades específicas:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium text-foreground">
                Conta de Cliente:
              </span>{' '}
              Permite realizar pedidos, acompanhar entregas, avaliar produtos e
              gerenciar preferências.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Conta de Estabelecimento:
              </span>{' '}
              Permite cadastrar produtos, receber e gerenciar pedidos,
              configurar opções de entrega e acompanhar avaliações.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Conta de Administrador/Gerente:
              </span>{' '}
              Permite gerenciar funcionários, acessar relatórios e configurar
              parâmetros do estabelecimento.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Conta de Funcionário:
              </span>{' '}
              Permite acesso limitado às funcionalidades do estabelecimento,
              conforme permissões concedidas pelo administrador.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Verificação de dados
          </h3>
          <p>
            Reservamo-nos o direito de verificar a autenticidade das informações
            fornecidas durante o cadastro e solicitar documentos adicionais
            quando necessário, especialmente para estabelecimentos.
          </p>
        </div>
      </section>

      {/* Serviços Oferecidos */}
      <section id="servicos" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <Store className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Serviços Oferecidos</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>Nossa plataforma oferece os seguintes serviços:</p>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Para Clientes
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Busca e visualização de estabelecimentos e seus cardápios;</li>
            <li>Realização de pedidos com opções de personalização;</li>
            <li>Acompanhamento em tempo real do status do pedido;</li>
            <li>
              Múltiplas opções de pagamento (PIX, cartões, vale-refeição,
              dinheiro);
            </li>
            <li>Avaliação de produtos e estabelecimentos;</li>
            <li>Histórico de pedidos e reordenação facilitada;</li>
            <li>Suporte ao cliente para resolução de problemas.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Para Estabelecimentos
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Criação e gerenciamento de perfil do estabelecimento;</li>
            <li>
              Cadastro e atualização de cardápio com categorias, produtos e
              opções;
            </li>
            <li>Recebimento e gerenciamento de pedidos em tempo real;</li>
            <li>Configuração de áreas de entrega, taxas e tempos estimados;</li>
            <li>Definição de horários de funcionamento;</li>
            <li>Acesso a relatórios e análises de vendas;</li>
            <li>Gerenciamento de avaliações e feedback de clientes;</li>
            <li>Suporte técnico e operacional.</li>
          </ul>

          <p className="mt-4">
            Reservamo-nos o direito de modificar, adicionar ou remover
            funcionalidades da plataforma a qualquer momento, mediante aviso
            prévio quando aplicável.
          </p>
        </div>
      </section>

      {/* Regras para Estabelecimentos */}
      <section id="estabelecimentos" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <Store className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Regras para Estabelecimentos</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Os estabelecimentos que utilizam nossa plataforma devem cumprir as
            seguintes regras:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Cadastro e informações
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Fornecer informações precisas sobre o estabelecimento, incluindo
              nome, endereço, CNPJ e contatos;
            </li>
            <li>
              Manter atualizados os horários de funcionamento e disponibilidade
              para recebimento de pedidos;
            </li>
            <li>
              Disponibilizar informações claras sobre produtos, incluindo
              descrições, ingredientes, preços e imagens;
            </li>
            <li>
              Informar corretamente sobre promoções, descontos e condições
              especiais.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Operação e atendimento
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Aceitar e processar pedidos recebidos durante o horário de
              funcionamento informado;
            </li>
            <li>
              Preparar os produtos conforme descritos no cardápio, respeitando
              as personalizações solicitadas;
            </li>
            <li>Garantir a qualidade, higiene e segurança dos alimentos;</li>
            <li>Cumprir os prazos estimados para preparo e entrega;</li>
            <li>Embalar adequadamente os produtos para transporte;</li>
            <li>
              Responder prontamente às comunicações de clientes e da plataforma;
            </li>
            <li>Tratar os clientes com cortesia e respeito.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Conformidade legal
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Possuir todas as licenças e autorizações necessárias para
              funcionamento;
            </li>
            <li>Cumprir as normas sanitárias e de segurança alimentar;</li>
            <li>Emitir documentos fiscais conforme exigido pela legislação;</li>
            <li>Respeitar as leis trabalhistas e de proteção ao consumidor;</li>
            <li>Manter em dia suas obrigações fiscais e tributárias.</li>
          </ul>
        </div>
      </section>

      {/* Regras para Clientes */}
      <section id="clientes" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <User className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Regras para Clientes</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Os clientes que utilizam nossa plataforma devem cumprir as seguintes
            regras:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Pedidos e pagamentos
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Fornecer informações precisas para entrega, incluindo endereço
              completo e referências;
            </li>
            <li>
              Realizar pedidos apenas quando houver intenção real de recebê-los
              e pagá-los;
            </li>
            <li>
              Efetuar o pagamento conforme o método escolhido, garantindo fundos
              suficientes;
            </li>
            <li>
              Estar disponível para receber o pedido no endereço informado;
            </li>
            <li>
              Verificar o pedido no momento da entrega e comunicar imediatamente
              qualquer problema.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Conduta e comunicação
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Tratar com respeito os entregadores e funcionários dos
              estabelecimentos;
            </li>
            <li>Fornecer avaliações honestas e construtivas;</li>
            <li>Comunicar problemas de forma clara e respeitosa;</li>
            <li>
              Não utilizar linguagem ofensiva ou ameaçadora nas comunicações;
            </li>
            <li>
              Não fazer solicitações que violem a lei ou as políticas da
              plataforma.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Cancelamentos
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Cancelar pedidos apenas quando realmente necessário e o mais
              rápido possível;
            </li>
            <li>
              Estar ciente de que cancelamentos frequentes podem resultar em
              restrições na conta;
            </li>
            <li>
              Compreender que cancelamentos após o início do preparo podem estar
              sujeitos a cobranças parciais ou totais.
            </li>
          </ul>
        </div>
      </section>

      {/* Pagamentos e Taxas */}
      <section id="pagamentos" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <Scale className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Pagamentos e Taxas</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Métodos de pagamento
          </h3>
          <p>Nossa plataforma aceita os seguintes métodos de pagamento:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>PIX;</li>
            <li>Cartões de crédito (Visa e Mastercard);</li>
            <li>Cartões de débito (Visa e Mastercard);</li>
            <li>Vale-refeição;</li>
            <li>Dinheiro (pagamento na entrega).</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Taxas para estabelecimentos
          </h3>
          <p>
            Os estabelecimentos parceiros estão sujeitos às seguintes taxas:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Taxa de adesão (quando aplicável);</li>
            <li>Taxas por serviços adicionais contratados.</li>
          </ul>
          <p>
            As taxas específicas são definidas no contrato de parceria e podem
            variar conforme o volume de vendas, localização e outros fatores.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Taxas para clientes
          </h3>
          <p>Os clientes podem estar sujeitos às seguintes taxas:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Taxa de entrega (definida pelo estabelecimento por bairro/região);
            </li>
            <li>Taxa de serviço (quando aplicável);</li>
            <li>Valor mínimo de pedido (definido pelo estabelecimento).</li>
          </ul>
          <p>
            Todas as taxas aplicáveis serão claramente informadas antes da
            finalização do pedido.
          </p>
        </div>
      </section>

      {/* Propriedade Intelectual */}
      <section id="propriedade" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <ShieldCheck className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Propriedade Intelectual</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Todos os direitos de propriedade intelectual relacionados à
            plataforma, incluindo software, design, logotipos, marcas, textos e
            conteúdo criado por nossa equipe, são de nossa propriedade exclusiva
            ou de nossos licenciadores.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Conteúdo da plataforma
          </h3>
          <p>Você não está autorizado a:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Copiar, modificar, distribuir ou reproduzir o conteúdo da
              plataforma sem autorização prévia;
            </li>
            <li>
              Utilizar nossas marcas, logotipos ou nomes comerciais sem
              permissão expressa;
            </li>
            <li>
              Realizar engenharia reversa, descompilar ou tentar extrair o
              código-fonte do software;
            </li>
            <li>
              Remover avisos de direitos autorais ou outras notificações de
              propriedade.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Conteúdo dos estabelecimentos
          </h3>
          <p>
            Os estabelecimentos mantêm os direitos sobre suas marcas, logotipos,
            imagens de produtos e descrições que fornecem à plataforma. Ao
            disponibilizar este conteúdo, os estabelecimentos concedem-nos uma
            licença não exclusiva para utilizá-lo na plataforma e em materiais
            promocionais relacionados.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Conteúdo dos usuários
          </h3>
          <p>
            Ao publicar avaliações, comentários ou outro conteúdo na plataforma,
            você concede-nos uma licença mundial, não exclusiva, gratuita e
            sublicenciável para usar, reproduzir, modificar, adaptar, publicar e
            exibir tal conteúdo em conexão com nossos serviços.
          </p>
          <p>
            Reservamo-nos o direito de remover qualquer conteúdo que viole estes
            termos ou que consideremos inadequado.
          </p>
        </div>
      </section>

      {/* Limitação de Responsabilidade */}
      <section id="responsabilidades" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Limitação de Responsabilidade</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Intermediação de serviços
          </h3>
          <p>
            Nossa plataforma atua como intermediária entre clientes e
            estabelecimentos. Não somos responsáveis por:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Qualidade, segurança, legalidade ou disponibilidade dos produtos
              oferecidos pelos estabelecimentos;
            </li>
            <li>
              Precisão das informações fornecidas pelos estabelecimentos sobre
              seus produtos;
            </li>
            <li>
              Atrasos ou falhas na entrega que não sejam diretamente causados
              por nossa plataforma;
            </li>
            <li>
              Problemas decorrentes de informações incorretas fornecidas pelos
              clientes;
            </li>
            <li>
              Disputas entre clientes e estabelecimentos, exceto como
              mediadores.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Disponibilidade da plataforma
          </h3>
          <p>
            Embora nos esforcemos para manter a plataforma disponível e
            funcionando corretamente, não garantimos que:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              A plataforma estará disponível ininterruptamente e sem erros;
            </li>
            <li>Falhas serão corrigidas imediatamente;</li>
            <li>
              A plataforma estará livre de vírus ou outros componentes
              prejudiciais.
            </li>
          </ul>
          <p>
            Realizamos manutenções periódicas para melhorar a plataforma, o que
            pode ocasionar indisponibilidade temporária.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Limitação de danos
          </h3>
          <p>
            Na extensão máxima permitida pela lei aplicável, não seremos
            responsáveis por quaisquer danos indiretos, incidentais, especiais,
            consequenciais ou punitivos, incluindo perda de lucros, dados ou
            oportunidades de negócios, resultantes do uso ou da impossibilidade
            de uso da plataforma.
          </p>
        </div>
      </section>

      {/* Condutas Proibidas */}
      <section id="proibicoes" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Condutas Proibidas</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>Ao utilizar nossa plataforma, você concorda em não:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Violar qualquer lei ou regulamento aplicável;</li>
            <li>
              Infringir direitos de propriedade intelectual, privacidade ou
              outros direitos de terceiros;
            </li>
            <li>
              Enviar, armazenar ou distribuir conteúdo ilegal, ofensivo,
              difamatório, fraudulento ou prejudicial;
            </li>
            <li>
              Realizar atividades que possam prejudicar, desativar,
              sobrecarregar ou comprometer nossos sistemas;
            </li>
            <li>
              Tentar acessar áreas restritas da plataforma sem autorização;
            </li>
            <li>
              Utilizar robôs, spiders, scrapers ou outros meios automatizados
              para acessar a plataforma;
            </li>
            <li>
              Coletar informações de outros usuários sem seu consentimento;
            </li>
            <li>Criar contas falsas ou enganosas;</li>
            <li>Utilizar a plataforma para fins diferentes dos previstos;</li>
            <li>Realizar pedidos falsos ou fraudulentos;</li>
            <li>Compartilhar sua conta com terceiros;</li>
            <li>
              Assediar, ameaçar ou intimidar outros usuários, estabelecimentos
              ou nossa equipe.
            </li>
          </ul>

          <p className="mt-4">
            Reservamo-nos o direito de investigar e tomar as medidas legais
            cabíveis contra qualquer violação destas proibições, incluindo a
            suspensão ou encerramento de contas e o relato às autoridades
            competentes.
          </p>
        </div>
      </section>

      {/* Cancelamento e Suspensão */}
      <section id="cancelamento" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Cancelamento e Suspensão</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Cancelamento pelo usuário
          </h3>
          <p>
            Você pode cancelar sua conta a qualquer momento através das
            configurações da plataforma ou entrando em contato com nosso suporte
            ao cliente. O cancelamento da conta não afeta as obrigações
            assumidas antes do cancelamento, como pagamentos pendentes.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Suspensão ou encerramento pela plataforma
          </h3>
          <p>
            Reservamo-nos o direito de suspender ou encerrar sua conta, a nosso
            critério, se:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Você violar estes Termos de Uso ou outras políticas da plataforma;
            </li>
            <li>Suspeitarmos de atividades fraudulentas ou ilegais;</li>
            <li>
              Seu comportamento for prejudicial a outros usuários,
              estabelecimentos ou à plataforma;
            </li>
            <li>Você fornecer informações falsas ou enganosas;</li>
            <li>Houver inatividade prolongada da conta;</li>
            <li>Por exigência legal ou regulatória.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
            Efeitos do cancelamento
          </h3>
          <p>Após o cancelamento ou encerramento da conta:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Você perderá acesso à plataforma e às informações associadas à sua
              conta;
            </li>
            <li>
              Pedidos em andamento poderão ser cancelados ou concluídos, a nosso
              critério;
            </li>
            <li>
              Poderemos reter certas informações conforme exigido por lei ou
              para fins legítimos de negócios;
            </li>
            <li>
              As disposições destes Termos que, por sua natureza, devam
              sobreviver ao término, permanecerão em vigor.
            </li>
          </ul>
        </div>
      </section>

      {/* Alterações nos Termos */}
      <section id="alteracoes" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <FileText className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Alterações nos Termos</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Podemos modificar estes Termos de Uso a qualquer momento, a nosso
            critério. As alterações entrarão em vigor após a publicação dos
            termos atualizados na plataforma.
          </p>
          <p>
            Para alterações significativas, notificaremos você através de um
            aviso na plataforma ou por e-mail. O uso continuado da plataforma
            após as alterações constituirá sua aceitação dos novos termos.
          </p>
          <p>
            Recomendamos que você revise periodicamente estes Termos para se
            manter informado sobre suas obrigações e direitos.
          </p>
        </div>
      </section>

      {/* Legislação Aplicável */}
      <section id="legislacao" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <Scale className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Legislação Aplicável</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Estes Termos de Uso são regidos e interpretados de acordo com as
            leis do Brasil, independentemente dos princípios de conflitos de
            leis.
          </p>
          <p>
            Qualquer disputa decorrente ou relacionada a estes Termos será
            submetida à jurisdição exclusiva dos tribunais da comarca de
            [Cidade/Estado], Brasil.
          </p>
          <p>
            Se qualquer disposição destes Termos for considerada inválida ou
            inexequível, as demais disposições permanecerão em pleno vigor e
            efeito.
          </p>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="mb-10 scroll-mt-20">
        <div className="flex items-center mb-4">
          <MessageSquare className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Contato</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Se você tiver dúvidas, preocupações ou sugestões relacionadas a
            estes Termos de Uso ou à nossa plataforma, entre em contato conosco:
          </p>
          {/* TODO: Add contact */}
          <div className="bg-muted/30 p-4 rounded-lg mt-4">
            <p>
              <strong>E-mail:</strong> contato@vendemtudo.com.br
            </p>
            <p>
              <strong>Telefone:</strong> (00) 0000-0000
            </p>
            <p>
              <strong>Endereço:</strong> Av. Principal, 1000 - Centro, Cidade -
              Estado, CEP 00000-000
            </p>
            <p>
              <strong>Horário de atendimento:</strong> Segunda a sexta, das 9h
              às 18h
            </p>
          </div>

          <p className="mt-4">
            Faremos o possível para responder prontamente a todas as
            comunicações.
          </p>
        </div>
      </section>
    </Container>
  )
}
