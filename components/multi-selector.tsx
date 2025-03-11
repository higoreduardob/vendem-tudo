import {
  useFormContext,
  Controller,
  type FieldValues,
  type FieldPath,
} from 'react-hook-form'
import { Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { FormControl, FormItem, FormLabel } from '@/components/ui/form'

const transitionProps = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
  mass: 0.5,
}

interface MultiSelectorProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  label: string
  options: FilterOptionsProps
  disabled?: boolean
}

export const MultiSelector = <TFieldValues extends FieldValues>({
  name,
  label,
  options,
  disabled = false,
}: MultiSelectorProps<TFieldValues>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>()

  const errorMessage = errors[name]?.message as string | undefined

  return (
    <FormItem className="w-full">
      <FormLabel>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <FormControl>
            <div>
              <motion.div
                className="flex flex-wrap gap-3 overflow-visible mt-2"
                layout
                transition={transitionProps}
              >
                {options.map((option) => {
                  const isSelected =
                    Array.isArray(field.value) &&
                    field.value.includes(option.value)
                  return (
                    <motion.button
                      type="button"
                      key={option.value}
                      onClick={() => {
                        if (disabled) return

                        const newValue = isSelected
                          ? (field.value as string[]).filter(
                              (v) => v !== option.value
                            )
                          : [...((field.value as string[]) || []), option.value]

                        field.onChange(newValue)
                      }}
                      layout
                      initial={false}
                      animate={{
                        backgroundColor: isSelected ? '#2a1711' : '#000',
                      }}
                      whileHover={{
                        backgroundColor: isSelected
                          ? '#2a1711'
                          : 'rgba(39, 39, 42, 0.8)',
                      }}
                      whileTap={{
                        backgroundColor: isSelected
                          ? '#1f1209'
                          : 'rgba(39, 39, 42, 0.9)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                        mass: 0.5,
                        backgroundColor: { duration: 0.1 },
                      }}
                      className={`
                        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        whitespace-nowrap overflow-hidden ring-1 ring-inset
                        ${
                          isSelected
                            ? 'text-[#ff9066] ring-[hsla(0,0%,100%,0.12)]'
                            : 'text-white ring-[hsla(0,0%,100%,0.06)]'
                        }
                        ${
                          disabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        }
                      `}
                      disabled={disabled}
                    >
                      <motion.div
                        className="relative flex items-center"
                        animate={{
                          width: isSelected ? 'auto' : '100%',
                          paddingRight: isSelected ? '1.5rem' : '0',
                        }}
                        transition={{
                          ease: [0.175, 0.885, 0.32, 1.275],
                          duration: 0.3,
                        }}
                      >
                        <span>{option.label}</span>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={transitionProps}
                              className="absolute right-0"
                            >
                              <div className="w-4 h-4 rounded-full bg-[#ff9066] flex items-center justify-center">
                                <Check
                                  className="w-3 h-3 text-[#2a1711]"
                                  strokeWidth={1.5}
                                />
                              </div>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.button>
                  )
                })}
              </motion.div>
              {errorMessage && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {errorMessage}
                </p>
              )}
            </div>
          </FormControl>
        )}
      />
    </FormItem>
  )
}
