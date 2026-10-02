'use client'

import { useEffect, useRef, useState } from 'react'

let splineModulePromise: Promise<typeof import('@splinetool/runtime')> | null = null

function getSplineModule() {
  if (!splineModulePromise) {
    splineModulePromise = import('@splinetool/runtime')
  }
  return splineModulePromise
}

// Pre-trigger runtime load on client initialization
if (typeof window !== 'undefined') {
  getSplineModule()
}

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    let app: any = null

    async function initSpline() {
      if (!canvasRef.current) return
      try {
        const { Application } = await getSplineModule()
        if (!isMounted || !canvasRef.current) return

        app = new Application(canvasRef.current)
        await app.load(scene)

        if (isMounted) {
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Spline load error:', err)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    initSpline()

    return () => {
      isMounted = false
      if (app && typeof app.dispose === 'function') {
        try {
          app.dispose()
        } catch (_) {}
      }
    }
  }, [scene])

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className || ''}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-transparent transition-opacity duration-200 pointer-events-none">
          <div className="w-6 h-6 border-2 border-steel border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  )
}
