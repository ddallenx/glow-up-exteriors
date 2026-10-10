import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

/** Caps a demand-driven canvas to `fps` frames per second (phones: smoother, cooler, longer battery). */
export default function Throttle({ fps = 30 }) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    const id = setInterval(invalidate, 1000 / fps)
    return () => clearInterval(id)
  }, [invalidate, fps])
  return null
}
