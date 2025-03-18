export const Hero = () => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="container mx-auto py-12 text-center relative space-y-8">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute h-2 w-2 bg-purple-500 rounded-full top-10 left-1/4 animate-pulse"></div>
          <div className="absolute h-2 w-2 bg-purple-500 rounded-full top-20 right-1/3 animate-pulse delay-300"></div>
          <div className="absolute h-2 w-2 bg-purple-500 rounded-full bottom-10 left-1/3 animate-pulse delay-700"></div>
          <div className="absolute h-2 w-2 bg-purple-500 rounded-full bottom-20 right-1/4 animate-pulse delay-500"></div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Central de Suporte</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Estamos aqui para ajudar você a aproveitar ao máximo nossa
            plataforma de delivery
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {/* <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
            <HelpCircle size={18} />
            Ver perguntas frequentes
          </Button>
          <Button
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800 flex items-center gap-2"
          >
            <Send size={18} />
            Contatar suporte
          </Button> */}
        </div>
      </section>
    </div>
  )
}
