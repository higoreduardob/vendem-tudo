'use client'

import { motion } from 'framer-motion'
import { ChefHat } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl mx-auto text-center dark:bg-gray-900 bg-white p-8 rounded-xl shadow-lg transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="mb-8 p-4 bg-orange-100 dark:bg-orange-900/20 rounded-full">
            <ChefHat className="h-16 w-16 text-orange-500 dark:text-orange-400" />
          </div>

          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Estamos aprimorando sua experiência!
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-md mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Nosso sistema está temporariamente fora do ar para melhorias.
            Estamos trabalhando para tornar seu serviço de delivery ainda
            melhor!
          </motion.p>

          <motion.div
            className="w-full max-w-sm h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.6, duration: 1.5 }}
          >
            <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 w-3/4"></div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
