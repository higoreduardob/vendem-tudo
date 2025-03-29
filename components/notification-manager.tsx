'use client'

import { useEffect, useState, useRef } from 'react'
import { Bell } from 'lucide-react'

import { ResponseType } from '@/app/(protected)/plataforma/pedidos/_features/columns'

import { useNotificationOrder } from '@/features/foods/orders/hooks/use-open-notification'

import { Button } from '@/components/ui/button'
import { Notifications } from '@/components/notifications'
import { OrderNotification } from '@/features/foods/orders/components/order-notification'

interface NotificationManagerProps {
  ordersPending: ResponseType[]
  dataUpdatedAt: number
}

export function NotificationManager({
  ordersPending,
  dataUpdatedAt,
}: NotificationManagerProps) {
  const { isOpen, onClose, onOpen } = useNotificationOrder()
  const [hasInteracted, setHasInteracted] = useState(false)
  const [audioInitialized, setAudioInitialized] = useState(false)
  const [audio] = useState(() =>
    typeof window !== 'undefined' ? new Audio('/notification.mp3') : null
  )

  // Keep track of previous orders count and last update timestamp
  const prevOrdersCountRef = useRef(ordersPending.length)
  const lastPlayedAtRef = useRef(0)

  // Set up interaction detection
  useEffect(() => {
    const markAsInteracted = () => {
      setHasInteracted(true)
      // Remove listeners after first interaction
      window.removeEventListener('click', markAsInteracted)
      window.removeEventListener('keydown', markAsInteracted)
      window.removeEventListener('touchstart', markAsInteracted)
    }

    window.addEventListener('click', markAsInteracted)
    window.addEventListener('keydown', markAsInteracted)
    window.addEventListener('touchstart', markAsInteracted)

    return () => {
      window.removeEventListener('click', markAsInteracted)
      window.removeEventListener('keydown', markAsInteracted)
      window.removeEventListener('touchstart', markAsInteracted)
    }
  }, [])

  // Initialize audio
  useEffect(() => {
    if (!audioInitialized && audio) {
      // Pre-load the audio file
      audio.load()
      setAudioInitialized(true)
    }
  }, [audio, audioInitialized])

  // Handle notifications when data is updated
  useEffect(() => {
    // Skip if no data update has occurred
    if (dataUpdatedAt === 0) return

    const currentCount = ordersPending.length

    // Check if we have pending orders
    if (currentCount > 0) {
      // Play sound if:
      // 1. We have pending orders
      // 2. This is a new data update (dataUpdatedAt changed)
      // 3. We haven't played a sound for this update yet
      // 4. User has interacted with the page
      if (hasInteracted && audio && dataUpdatedAt > lastPlayedAtRef.current) {
        // Update the last played timestamp
        lastPlayedAtRef.current = dataUpdatedAt

        // Reset the audio to the beginning
        audio.currentTime = 0
        audio.play().catch((err) => {
          console.error('Notificação sonora falhou:', err)
        })

        // Show system notification if page is hidden
        if (document.hidden && Notification.permission === 'granted') {
          new Notification('Novo Pedido', {
            body: `Você tem ${currentCount} pedido(s) pendente(s)`,
            icon: '/favicon.ico',
          })
        }
      }
    }

    // Always update the previous count
    prevOrdersCountRef.current = currentCount
  }, [ordersPending, dataUpdatedAt, hasInteracted, audio])

  // Request notification permission
  useEffect(() => {
    if (
      Notification.permission !== 'granted' &&
      Notification.permission !== 'denied'
    ) {
      Notification.requestPermission()
    }
  }, [])

  return (
    <>
      <Button
        variant="ghost"
        className="relative"
        onClick={() => {
          onOpen()
          setHasInteracted(true)
        }}
      >
        <span className="absolute top-0 left-6 flex items-center justify-center h-[16px] min-w-[16px] text-[12px] text-white bg-red-600 rounded-full">
          {ordersPending.length}
        </span>
        <Bell className="h-[1.2rem] w-[1.2rem]" />
      </Button>

      <Notifications isOpen={isOpen} handleClose={onClose}>
        {!!ordersPending.length ? (
          <OrderNotification orders={ordersPending} />
        ) : (
          <span className="text-muted-foreground text-sm">
            Nenhum pedido pendente
          </span>
        )}
      </Notifications>
    </>
  )
}
