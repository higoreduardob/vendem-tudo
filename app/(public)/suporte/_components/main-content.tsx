import { FileText, HelpCircle, Send } from 'lucide-react'

import { Faq } from '@/app/(public)/suporte/_components/faq'
import { Guide } from '@/app/(public)/suporte/_components/guide'
import { Contact } from '@/app/(public)/suporte/_components/contact'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const MainContent = () => {
  return (
    <div className="space-y-20">
      {/* Main Content */}
      <section className="container mx-auto px-4 py-10">
        <Tabs defaultValue="faq" className="w-full space-y-6">
          <TabsList
            className="grid w-full grid-cols-3 rounded-lg h-12 px-2"
            defaultValue="faq"
          >
            <TabsTrigger
              value="faq"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white p-2"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Perguntas Frequentes
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white p-2"
            >
              <Send className="mr-2 h-4 w-4" />
              Formulário de Contato
            </TabsTrigger>
            <TabsTrigger
              value="guide"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white p-2"
            >
              <FileText className="mr-2 h-4 w-4" />
              Guia de Uso
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq">
            <Faq />
          </TabsContent>
          <TabsContent value="contact">
            <Contact />
          </TabsContent>
          <TabsContent value="guide">
            <Guide />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
