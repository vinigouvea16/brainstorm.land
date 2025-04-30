'use client'
import WhatsApp from './icons/whatsapp'
// import { useEffect, useState } from 'react'
import Button from './ui/button'

export default function FloatingWhatsappButton() {
  // const [isMobile, setIsMobile] = useState(false)

  // useEffect(() => {
  //   const checkMobile = () => {
  //     setIsMobile(window.innerWidth <= 768)
  //   }

  //   checkMobile()
  //   window.addEventListener('resize', checkMobile)
  //   return () => window.removeEventListener('resize', checkMobile)
  // }, [])

  // if (!isMobile) return null

  return (
    <a
      href="https://wa.me/5541992478837"
      target="_blank"
      rel="noopener noreferrer"
      className="md:hidden fixed bottom-20 right-6 z-50 transition-colors bg-transparent "
    >
      <Button variant="whatsapp" size="sm">
        <WhatsApp />
      </Button>
    </a>
  )
}
