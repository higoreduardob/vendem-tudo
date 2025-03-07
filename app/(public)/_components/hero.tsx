'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FloatingPaper } from '@/app/(public)/_components/floating-paper'
import { RoboAnimation } from '@/app/(public)/_components/robo-animation'

export default function Hero() {
  return (
    <div className="relative min-h-[calc(100vh-76px)] flex items-center px-4 mx-auto">
      {/* Floating papers background */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingPaper count={6} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Transforme seu negócio com o
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                {' '}
                Poder da IA
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto"
          >
            Deixe a inteligência artificial trabalhar para você, faça mais
            vendas no automático.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/cadastrar">
              <Button size="lg" variant="purple">
                <FileText className="mr-2 h-5 w-5" />
                Cadastrar
              </Button>
            </Link>
            <Link href="/entrar">
              <Button size="lg" variant="outline">
                <Sparkles className="mr-2 h-5 w-5" />
                Entrar
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Animated robot */}
      <div className="absolute bottom-0 right-0 w-96 h-96">
        <RoboAnimation />
      </div>
    </div>
  )
}
