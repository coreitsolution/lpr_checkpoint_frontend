import { useEffect, useRef } from 'react'

interface VideoPlayerProps {
  streamUrl: string | null
  id: string
  customClass?: string
}

export const VideoPlayer = ({ streamUrl, id, customClass }: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    let canvas: HTMLCanvasElement | null = null
    
    const setupPlayer = () => {
      if (!containerRef.current || !streamUrl) return
      
      // Clean up existing canvas and player
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch (error) {
          console.warn('Error destroying player:', error)
        }
        playerRef.current = null
      }

      // Remove existing canvas if any
      const existingCanvas = containerRef.current.querySelector('canvas')
      if (existingCanvas) {
        existingCanvas.remove()
      }

      // Create new canvas
      canvas = document.createElement('canvas')
      canvas.id = id
      canvas.className = 'm-0 w-full h-full'
      containerRef.current.appendChild(canvas)

      // Initialize new player
      try {
        if (window.JSMpeg) {
          playerRef.current = new window.JSMpeg.Player(streamUrl, {
            canvas: canvas,
            progressive: true,
            onError: (error: Error) => {
              console.error('JSMpeg Player Error:', error)
            }
          })
        }
      } catch (error) {
        console.error('Error creating JSMpeg player:', error)
      }
    }

    setupPlayer()

    // Cleanup function
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch (error) {
          console.warn('Error destroying player:', error)
        }
        playerRef.current = null
      }
      
      // Remove canvas on cleanup
      if (canvas && canvas.parentNode) {
        canvas.remove()
      }
    }
  }, [streamUrl, id])

  return (
    <div 
      ref={containerRef}
      className={`flex py-[0.3rem] px-[1rem] ${customClass || ''}`}
    />
  )
}