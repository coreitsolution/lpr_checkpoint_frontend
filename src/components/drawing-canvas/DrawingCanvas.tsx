import React, { useRef, useEffect, useState } from "react"

// Types
import { DetectionArea } from "./types"
import {
  CameraDetailSettings
} from '../../features/camera-settings/cameraSettingsTypes'

interface DrawingCanvasProps {
  imgRef: HTMLImageElement
  onShapeDrawn?: (shape: DetectionArea) => void
  isDrawingEnabled: boolean
  clearCanvas: boolean
  selectedRow: CameraDetailSettings | null
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  imgRef,
  onShapeDrawn,
  isDrawingEnabled,
  clearCanvas,
  selectedRow,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [points, setPoints] = useState<{ x: number; y: number }[]>([])
  const [shapeClosed, setShapeClosed] = useState(false)

  const radiusThreshold = 5

  const handleCanvasClick = (event: React.MouseEvent) => {
    if (!isDrawingEnabled) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    setPoints((prevPoints) => [...prevPoints, { x, y }])
  }

  const arePointsClose = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
    return distance <= radiusThreshold
  }

  useEffect(() => {
    if (selectedRow?.detection_area && selectedRow?.detection_area !== "") {
      const detectionArea:DetectionArea  = JSON.parse(selectedRow?.detection_area)
      setPoints(detectionArea.points)
    }
  }, [selectedRow])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (clearCanvas) {
      setPoints([])
      setShapeClosed(false)
      return
    }

    // Draw the shape
    if (points.length > 0) {
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)

      points.forEach((point, index) => {
        // Draw each point
        ctx.beginPath()
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = "#7e22ce"
        ctx.fill()
        ctx.closePath()

        if (index > 0) {
          ctx.beginPath()
          ctx.moveTo(points[index - 1].x, points[index - 1].y)
          ctx.lineTo(point.x, point.y)
          ctx.strokeStyle = "#7e22ce"
          ctx.lineWidth = 4
          ctx.stroke()
          ctx.closePath()
        }
      })

      // Check if the first and last points are close
      if (points.length > 2 && arePointsClose(points[0], points[points.length - 1])) {
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        
        points.forEach((point) => {
          ctx.lineTo(point.x, point.y)
        })

        ctx.closePath()
        ctx.fillStyle = "rgb(239,68,68, 0.5)"
        ctx.fill()
        setShapeClosed(true)
      }
    }
  }, [points, clearCanvas])

  useEffect(() => {
    if (clearCanvas) setPoints([])
  }, [clearCanvas])

  useEffect(() => {
    if (shapeClosed && points.length > 2 && onShapeDrawn) {
      onShapeDrawn({
        points: points,
        frame: {
          width: imgRef.width,
          height: imgRef.height,
        }
      })
      setShapeClosed(false)
    }
  }, [shapeClosed, points, imgRef, onShapeDrawn])

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      className="absolute top-0 left-0 w-full h-full"
      width={imgRef.width}
      height={imgRef.height}
    />
  )
}

export default DrawingCanvas
