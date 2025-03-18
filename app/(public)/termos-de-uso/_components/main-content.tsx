import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const MainContent = () => {
  return (
    <div className="space-y-20">
      {/* Main Content */}
      <section className="container mx-auto py-8 mb-16">
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-400">
              Última atualização: 18 de março de 2025
            </p>
            <Link href="/">
              <Button
                variant="ghost"
                className="text-purple-400 hover:text-purple-300 hover:bg-gray-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o início
              </Button>
            </Link>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4 text-white">
              1. Introdução
            </h2>
            <p className="text-gray-300 mb-4">
              Bem-vindo à DeliveryIA, uma plataforma inovadora que conecta
              estabelecimentos de alimentação a clientes, facilitando o processo
              de pedidos e entregas de comida. Estes Termos de Uso estabelecem
              as regras e diretrizes para a utilização da nossa plataforma.
            </p>
            <p className="text-gray-300 mb-6">
              Ao acessar ou utilizar a plataforma DeliveryIA, você concorda com
              estes Termos de Uso em sua totalidade. Se você não concordar com
              qualquer parte destes termos, solicitamos que não utilize nossos
              serviços.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-white">
              2. Cadastro e Responsabilidades do Usuário
            </h2>

            <h3 className="text-xl font-semibold mb-3 text-white">
              2.1 Tipos de Usuários
            </h3>
            <p className="text-gray-300 mb-4">
              A plataforma DeliveryIA possui diferentes tipos de usuários, cada
              um com responsabilidades e permissões específicas:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>
                <strong>Administradores:</strong> Responsáveis pela gestão geral
                da plataforma, incluindo aprovação de estabelecimentos e
                resolução de disputas.
              </li>
              <li>
                <strong>Donos de Loja:</strong> Proprietários de
                estabelecimentos que utilizam a plataforma para vender seus
                produtos.
              </li>
              <li>
                <strong>Gerentes:</strong> Usuários designados pelos Donos de
                Loja para auxiliar na gestão do estabelecimento na plataforma.
              </li>
              <li>
                <strong>Funcionários:</strong> Colaboradores dos
                estabelecimentos com permissões limitadas para gerenciar
                pedidos.
              </li>
              <li>
                <strong>Clientes:</strong> Usuários que utilizam a plataforma
                para realizar pedidos de alimentos.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white">
              2.2 Informações de Cadastro
            </h3>
            <p className="text-gray-300 mb-4">
              Ao se cadastrar na plataforma DeliveryIA, você se compromete a
              fornecer informações verdadeiras, precisas, atuais e completas
              sobre si mesmo ou seu estabelecimento. Você é inteiramente
              responsável pela veracidade das informações fornecidas.
            </p>
            <p className="text-gray-300 mb-4">
              A DeliveryIA se reserva o direito de verificar as informações
              fornecidas e solicitar documentação adicional para confirmar a
              identidade dos usuários ou a existência legal dos
              estabelecimentos.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-white">
              2.3 Verificação de E-mail e Documentação
            </h3>
            <p className="text-gray-300 mb-6">
              Para garantir a segurança e a confiabilidade da plataforma,
              realizamos a verificação de e-mail para todos os usuários.
              Estabelecimentos também passarão por um processo de verificação de
              documentação, que pode incluir CNPJ, alvará de funcionamento e
              licença sanitária, quando aplicável.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-white">
              3. Uso da Plataforma
            </h2>

            <h3 className="text-xl font-semibold mb-3 text-white">
              3.1 Regras para Lojistas
            </h3>
            <p className="text-gray-300 mb-4">
              Os lojistas cadastrados na plataforma DeliveryIA devem seguir as
              seguintes regras:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>
                Fornecer informações precisas sobre seus produtos, incluindo
                descrição, preço, ingredientes e potenciais alérgenos.
              </li>
              <li>
                Manter o cardápio atualizado, removendo itens indisponíveis.
              </li>
              <li>
                Processar os pedidos dentro do tempo estimado informado na
                plataforma.
              </li>
              <li>
                Garantir que os alimentos sejam preparados em conformidade com
                as normas sanitárias vigentes.
              </li>
              <li>
                Responder prontamente às mensagens de clientes e da equipe
                DeliveryIA.
              </li>
              <li>
                Não utilizar a plataforma para vender produtos ilegais ou não
                autorizados.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white">
              3.2 Regras para Clientes
            </h3>
            <p className="text-gray-300 mb-4">
              Os clientes que utilizam a plataforma DeliveryIA devem seguir as
              seguintes regras:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>
                Fornecer informações precisas para entrega, incluindo endereço
                completo e referências.
              </li>
              <li>
                Estar disponível para receber o pedido no endereço informado ou
                comunicar alterações com antecedência.
              </li>
              <li>
                Realizar o pagamento conforme as opções disponibilizadas na
                plataforma.
              </li>
              <li>
                Tratar entregadores e atendentes com respeito e cordialidade.
              </li>
              <li>
                Não utilizar a plataforma para fins fraudulentos ou abusivos.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white">
              3.3 Proibições Gerais
            </h3>
            <p className="text-gray-300 mb-4">
              É expressamente proibido a todos os usuários da plataforma
              DeliveryIA:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>
                Utilizar a plataforma para qualquer finalidade ilegal ou não
                autorizada.
              </li>
              <li>
                Tentar acessar áreas restritas da plataforma ou burlar medidas
                de segurança.
              </li>
              <li>
                Enviar conteúdo ofensivo, difamatório, obsceno ou que viole
                direitos de terceiros.
              </li>
              <li>
                Realizar ações que possam danificar, sobrecarregar ou prejudicar
                o funcionamento da plataforma.
              </li>
              <li>
                Utilizar a plataforma para enviar spam, vírus ou outros códigos
                maliciosos.
              </li>
              <li>Coletar informações de outros usuários sem autorização.</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 text-white">
              4. Pagamentos e Repasses
            </h2>

            <h3 className="text-xl font-semibold mb-3 text-white">
              4.1 Métodos de Pagamento
            </h3>
            <p className="text-gray-300 mb-4">
              A plataforma DeliveryIA aceita os seguintes métodos de pagamento:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>PIX</li>
              <li>
                Cartão de crédito (parcelamento conforme política do
                estabelecimento)
              </li>
              <li>Cartão de débito</li>
              <li>Vale-refeição (bandeiras selecionadas)</li>
              <li>Dinheiro (pagamento na entrega)</li>
            </ul>
            <p className="text-gray-300 mb-4">
              A disponibilidade de cada método de pagamento pode variar de
              acordo com o estabelecimento e a região.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-white">
              4.2 Repasses aos Lojistas
            </h3>
            <p className="text-gray-300 mb-4">
              Os valores recebidos pela plataforma DeliveryIA serão repassados
              aos lojistas conforme as seguintes regras:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>
                Pagamentos via PIX: repasse em até 1 dia útil após a confirmação
                da entrega.
              </li>
              <li>
                Pagamentos via cartão de crédito: repasse em até 14 dias após a
                confirmação da entrega.
              </li>
              <li>
                Pagamentos via cartão de débito: repasse em até 3 dias úteis
                após a confirmação da entrega.
              </li>
              <li>
                Pagamentos via vale-refeição: repasse em até 30 dias após a
                confirmação da entrega.
              </li>
              <li>
                Pagamentos em dinheiro: o valor é retido pelo estabelecimento,
                sendo descontada a taxa da plataforma no próximo repasse.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 text-white">
              5. Cancelamentos e Reembolsos
            </h2>

            <h3 className="text-xl font-semibold mb-3 text-white">
              5.1 Cancelamento de Pedidos
            </h3>
            <p className="text-gray-300 mb-4">
              As diretrizes para cancelamento de pedidos são as seguintes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>
                O cliente pode cancelar o pedido sem custos antes da confirmação
                pelo estabelecimento.
              </li>
              <li>
                Após a confirmação pelo estabelecimento, o cancelamento pelo
                cliente pode estar sujeito a taxas, dependendo do estágio de
                preparação do pedido.
              </li>
              <li>
                O estabelecimento pode cancelar um pedido em casos excepcionais,
                como falta de ingredientes ou impossibilidade de entrega na
                região indicada, devendo comunicar imediatamente o cliente.
              </li>
              <li>
                A DeliveryIA se reserva o direito de cancelar pedidos em caso de
                suspeita de fraude ou violação dos termos de uso.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white">
              5.2 Política de Reembolso
            </h3>
            <p className="text-gray-300 mb-4">
              A política de reembolso da plataforma DeliveryIA é a seguinte:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>
                Pedidos cancelados antes da confirmação pelo estabelecimento:
                reembolso integral.
              </li>
              <li>
                Pedidos cancelados pelo estabelecimento: reembolso integral.
              </li>
              <li>
                Pedidos não entregues ou entregues com problemas significativos
                (alimentos impróprios para consumo, pedido incompleto):
                reembolso integral ou parcial, conforme avaliação da DeliveryIA.
              </li>
              <li>
                Pedidos entregues com atraso significativo: reembolso parcial ou
                créditos para uso futuro, conforme avaliação da DeliveryIA.
              </li>
              <li>
                O prazo para solicitação de reembolso é de até 24 horas após a
                entrega ou tentativa de entrega.
              </li>
              <li>
                O prazo para processamento do reembolso varia de acordo com o
                método de pagamento utilizado, podendo levar de 1 a 30 dias
                úteis.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 text-white">
              6. Suspensão e Exclusão de Contas
            </h2>

            <h3 className="text-xl font-semibold mb-3 text-white">
              6.1 Motivos para Suspensão ou Exclusão
            </h3>
            <p className="text-gray-300 mb-4">
              A DeliveryIA pode suspender ou excluir contas pelos seguintes
              motivos:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>Fornecimento de informações falsas no cadastro.</li>
              <li>Violação de qualquer cláusula destes Termos de Uso.</li>
              <li>Prática de fraudes ou atividades ilegais.</li>
              <li>
                Comportamento abusivo ou ofensivo com outros usuários,
                entregadores ou equipe da DeliveryIA.
              </li>
              <li>
                Recebimento recorrente de avaliações negativas (para
                estabelecimentos).
              </li>
              <li>
                Cancelamento excessivo de pedidos sem justificativa válida.
              </li>
              <li>Inatividade prolongada (mais de 12 meses sem acesso).</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white">
              6.2 Procedimento para Contestação
            </h3>
            <p className="text-gray-300 mb-6">
              Usuários que tiverem suas contas suspensas ou excluídas poderão
              contestar a decisão através do canal oficial de suporte,
              apresentando justificativas e evidências que possam reverter a
              situação. Cada caso será analisado individualmente pela equipe da
              DeliveryIA, que poderá manter ou reverter a decisão.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-white">
              7. Alterações nos Termos
            </h2>
            <p className="text-gray-300 mb-4">
              A DeliveryIA se reserva o direito de modificar estes Termos de Uso
              a qualquer momento, publicando a versão atualizada na plataforma.
              As alterações entrarão em vigor imediatamente após sua publicação.
            </p>
            <p className="text-gray-300 mb-6">
              Notificaremos os usuários sobre alterações significativas através
              do e-mail cadastrado ou por meio de notificações na plataforma. O
              uso continuado da plataforma após a publicação das alterações
              constitui aceitação dos novos termos.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-white">
              8. Contato e Suporte
            </h2>
            <p className="text-gray-300 mb-4">
              Para dúvidas, esclarecimentos ou contestações relacionadas a estes
              Termos de Uso, entre em contato com nossa equipe de suporte
              através dos seguintes canais:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>E-mail: termos@deliveryia.com.br</li>
              <li>
                Chat: disponível na plataforma de segunda a sexta, das 8h às 18h
              </li>
              <li>
                Formulário de contato: disponível na seção de Suporte do site
              </li>
            </ul>

            <div className="bg-gray-800 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-3 text-white flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-purple-500" />
                Aceitação dos Termos
              </h3>
              <p className="text-gray-300">
                Ao utilizar a plataforma DeliveryIA, você confirma que leu,
                entendeu e concorda com estes Termos de Uso em sua totalidade.
                Se você não concorda com qualquer parte destes termos,
                solicitamos que não utilize nossos serviços.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
