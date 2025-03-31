    TODO:
      1 . TODO: Check handleOpenStore -> app/(protected)/plataforma/layout.tsx: Método para habilitar o enabled da store
      2 . Implement Recaptcha -> app/api/[...route]/authenticate.ts
      3 . Add responsive table -> components/data-table.tsx
      4 . Check additionals/Check ingredients -> components/order-recipiet.tsx: Verificar se tem necessidade quantidade de informação
      5 . Change fetch in list -> features/foods/additionals/api/use-get-food-additionals.ts e features/foods/additionals/options/api/use-get-food-options.ts
      6 . Add responsive -> features/foods/components/form-food.tsx
      7 . Add google smtp to send email

    Responsivo:
      Plataforma:
        Sidebar com Title mobile
        Painel/Alimentos/Categorias/Pedidos/Clientes/Adicionais/Opcções: Tabela
        Adicionar Alimento: Text rich
        Loja: Cabeçalho/Horários/Tabela de entrega
      Loja:
        Conta/Pedidos: Tabela

    MELHORIAS:

    2 - Feat
      1 . Dark mode: Melhor a loja para dark mode
      2 . Loja: 1. Melhor o dark mode do multiselector
      3 . Add Cupom
        {/* <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-6 bg-gray-100 flex items-center justify-center rotate-12">
                <div className="w-6 h-4 border border-dashed border-gray-400"></div>
              </div>
              <div>
                <p className="font-medium">Cupom</p>
                <p className="text-sm text-muted-foreground">
                  1 cupom disponível
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator /> */}
      4 . Favoritos do cliente
      5 . Adicionar nfe Focus nfe
      6 . Adicionar paywall com plano escolhido
      7 . Demonstrações: 1. Pesquisar como Code with Antonio faz os vídeos dele
      8 . Definição de destaques para +vendidos e +avaliados
      9 . No product card reaver as badges de destaques
      10 . Suporte colocar FAQ com tempo de solucionamento
      11 . Colocar planos para o cliente (lojista)
      12 . Suporte integrar envio de email de perguntas
      13 . Suporte whatsapp de contato
      14 . Finalizar desempenho
      15 . Change message authenticate (2 Feat)
      16 . Notificações: 1. Fazer push notifications, e pesquisar como fazer no next para os registros de pedidos | 2 . check stages in order food
      17 . Melhorar o estilo do email enviado
      18 . Responsivo da gestão
      19 . Check all codes - refactor
      20 . Review this code
        // .post(
        //   '/sign-up-information',
        //   zValidator('json', signUpInformationSchema),
        //   zValidator(
        //     'query',
        //     z.object({
        //       token: z.string().optional(),
        //       role: z.nativeEnum(UserRole).optional(),
        //     })
        //   ),
        //   async (c) => {
        //     const { token, role } = c.req.valid('query')
        //     const validatedFields = c.req.valid('json')

        //     if (!token || !role) return c.json({ error: 'Usuário inválido' }, 400)

        //     if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
        //     const { address, ...values } = validatedFields

        //     const existingUserToken = await db.verificationToken.findUnique({
        //       where: { token },
        //     })
        //     if (!existingUserToken)
        //       return c.json({ error: 'Usuário não cadastrado' }, 404)

        //     const hasExpired = new Date(existingUserToken.expires) < new Date()
        //     if (hasExpired) {
        //       return c.json({ error: 'Token expirado' }, 400)
        //     }

        //     const existingUser = await db.user.findUnique({
        //       where: { email: existingUserToken.email },
        //     })
        //     if (!existingUser) {
        //       return c.json({ error: 'Usuário não cadastrado' }, 404)
        //     }

        //     await db.user.update({
        //       where: { email: existingUser.email, id: existingUser.id },
        //       data: {
        //         ...values,
        //         completedAccount: new Date(),
        //         address: { create: { ...address } },
        //       },
        //     })

        //     await db.verificationToken.delete({
        //       where: { id: existingUserToken.id, token: existingUserToken.token },
        //     })

        //     if (existingUser.role === UserRole.OWNER) {
        //       const verificationToken = await generateVerificationToken(
        //         existingUser.email
        //       )

        //       return c.json(
        //         {
        //           success: 'Cadastro completado, registre sua loja',
        //           token: verificationToken.token,
        //         },
        //         200
        //       )
        //     }

        //     return c.json({ success: 'Cadastro completado' }, 200)
        //   }
        // )
