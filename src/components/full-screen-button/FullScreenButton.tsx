"use client"
import React, { useState, useEffect } from "react"
import { motion, useMotionValue } from "framer-motion"

// Types
import { DocumentElementWithFullscreen, DocumentWithFullscreen } from "../../features/api/types"

interface FullScreenButtonProps {
  constraintsRef: React.RefObject<HTMLDivElement>
}

const FullScreenButton: React.FC<FullScreenButtonProps> = ({constraintsRef}) => {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isDrag, setIsDrag] = useState(false)
  const [baseHeight, setBaseHeight] = useState(0)
  const y = useMotionValue((window.innerHeight - 10) - (window.screen.height - window.screen.availHeight))
  const x = useMotionValue(10)

  useEffect(() => {
    const currentY = y.get()
    if (currentY + 50 >= window.innerHeight) {
      y.set(window.innerHeight - 64)
    }
  })

  useEffect(() => {
    if (window.innerHeight < window.screen.height && baseHeight === 0) {
      setBaseHeight(window.innerHeight)
    }
  }, [])

  const isWindowFullscreen = (): boolean => {
    return window.innerWidth === screen.availWidth && window.innerHeight === screen.availHeight
  }
  
  const isDocumentFullscreen = (): boolean => {
    const doc = document as DocumentWithFullscreen
  
    return !!(
      doc.fullscreenElement ||
      doc.mozFullScreenElement ||
      doc.webkitFullscreenElement ||
      doc.msFullscreenElement
    )
  }
  
  const isInFullscreen = () => {
    return isWindowFullscreen() || isDocumentFullscreen()
  }

  const requestFullscreen = async (element: DocumentElementWithFullscreen) => {
    if (element.requestFullscreen) {
      await element.requestFullscreen()
    } 
    else if (element.msRequestFullscreen) {
      await element.msRequestFullscreen()
    } 
    else if (element.webkitRequestFullscreen) {
      await element.webkitRequestFullscreen()
    } 
    else if (element.mozRequestFullScreen) {
      await element.mozRequestFullScreen()
    }
  }
  
  const exitFullscreen = async (doc: DocumentWithFullscreen) => {
    if (doc.exitFullscreen) {
      await doc.exitFullscreen()
    } 
    else if (doc.msExitFullscreen) {
      await doc.msExitFullscreen()
    } 
    else if (doc.webkitExitFullscreen) {
      await doc.webkitExitFullscreen()
    } 
    else if (doc.mozCancelFullScreen) {
      await doc.mozCancelFullScreen()
    }
  }

  useEffect(() => {
    const handleFullscreenEvent = () => {
      setIsFullScreen(isInFullscreen())
    }

    const handleF11Press = async (e: KeyboardEvent) => {
      if (e.key === "F11") {
        e.preventDefault()
        await toggleFullScreen()
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenEvent)
    document.addEventListener("webkitfullscreenchange", handleFullscreenEvent)
    document.addEventListener("mozfullscreenchange", handleFullscreenEvent)
    document.addEventListener("msfullscreenchange", handleFullscreenEvent)
    window.addEventListener("resize", handleFullscreenEvent)
    window.addEventListener("keydown", handleF11Press)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenEvent)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenEvent)
      document.removeEventListener("mozfullscreenchange", handleFullscreenEvent)
      document.removeEventListener("msfullscreenchange", handleFullscreenEvent)
      window.removeEventListener("resize", handleFullscreenEvent)
      window.removeEventListener("keydown", handleF11Press)
    }
  }, [])

  const toggleFullScreen = async (): Promise<void> => {
    if (isDrag) return

    if (!isInFullscreen()) {
      await requestFullscreen(document.documentElement)
    } 
    else {
      await exitFullscreen(document)
    }

    setIsFullScreen(isInFullscreen())
  }

  const onDragStart = () => {
    setIsDrag(true)
  }

  const onDragEnd = () => {
    setTimeout(() => {
      setIsDrag(false)
    }, 200)
  }

  const dragTransitionConfig = {
    power: 0.8,
    timeConstant: 500,
  }

  return (
    <motion.div
        drag
        dragConstraints={constraintsRef}
        dragTransition={dragTransitionConfig}
        dragMomentum={true}
        style={{
          width: 50,
          height: 50,
          borderRadius: 10,
          x,
          y,
        }}
        className="fixed z-50 cursor-grab active:cursor-grabbing pointer-events-auto"
        onDragStart={onDragStart} 
        onDragEnd={onDragEnd} 
        onClick={(e) => e.stopPropagation()}
    >
      <motion.img 
        src={!isFullScreen ? "/icons/full-screen.png" : "/icons/exit-full-screen.png"}
        alt={!isFullScreen ? "Full Screen" : "Exit Full Screen"}
        onClick={toggleFullScreen}
        className="w-full h-full pointer-events-auto"
        draggable={false}
      />
    </motion.div>
  )
}

export default FullScreenButton
