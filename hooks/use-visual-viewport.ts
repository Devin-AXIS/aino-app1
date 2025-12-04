"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Hook to track visual viewport changes for mobile keyboard handling.
 * Returns the viewport height and keyboard offset for smooth layout adjustments.
 * Uses CSS custom properties for performant updates.
 */
export function useVisualViewport() {
  const [viewportHeight, setViewportHeight] = useState<number>(0)
  const [keyboardOffset, setKeyboardOffset] = useState<number>(0)
  const rafRef = useRef<number | null>(null)
  const lastHeightRef = useRef<number>(0)

  useEffect(() => {
    if (typeof window === "undefined") return

    const updateViewport = () => {
      const innerHeight = window.innerHeight
      const vp = window.visualViewport
      const currentViewportHeight = vp ? vp.height : innerHeight
      const currentKeyboardOffset = innerHeight - currentViewportHeight

      // Only update if change is significant (avoid jitter)
      if (Math.abs(currentViewportHeight - lastHeightRef.current) > 1) {
        lastHeightRef.current = currentViewportHeight
        setViewportHeight(currentViewportHeight)
        setKeyboardOffset(currentKeyboardOffset)

        // Set CSS custom properties for use in components
        document.documentElement.style.setProperty("--viewport-height", `${currentViewportHeight}px`)
        document.documentElement.style.setProperty("--keyboard-offset", `${currentKeyboardOffset}px`)
        document.documentElement.style.setProperty(
          "--is-keyboard-open",
          currentKeyboardOffset > 20 ? "1" : "0",
        )
      }

      rafRef.current = null
    }

    const scheduleUpdate = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updateViewport)
      }
    }

    // Initial measurement
    updateViewport()

    // Use visualViewport API if available (modern mobile browsers)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", scheduleUpdate, { passive: true })
      // Note: We don't listen to scroll events to avoid conflicts
    } else {
      // Fallback for older browsers
      window.addEventListener("resize", scheduleUpdate, { passive: true })
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", scheduleUpdate)
      } else {
        window.removeEventListener("resize", scheduleUpdate)
      }
    }
  }, [])

  return { viewportHeight, keyboardOffset }
}
