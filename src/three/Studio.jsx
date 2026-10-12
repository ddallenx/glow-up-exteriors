import { Environment, Lightformer } from '@react-three/drei'

/** Blue studio lighting for glass: crisp white strips, iMessage-blue wash, cool fill. Generated locally — no network. */
export default function Studio({ intensity = 1, res = 128 }) {
  return (
    <Environment resolution={res} frames={1}>
      <Lightformer form="rect" intensity={3.2 * intensity} position={[0, 6, 6]} scale={[14, 3, 1]} color="#ffffff" />
      <Lightformer form="rect" intensity={5 * intensity} position={[-8, 2, 3]} rotation-y={Math.PI / 2.4} scale={[9, 4, 1]} color="#007aff" />
      <Lightformer form="rect" intensity={3 * intensity} position={[8, 3, 2]} rotation-y={-Math.PI / 2.4} scale={[9, 4, 1]} color="#4da3ff" />
      <Lightformer form="ring" intensity={2.2 * intensity} position={[0, 2, -8]} scale={7} color="#2fb8ff" />
      <Lightformer form="rect" intensity={0.8 * intensity} position={[0, -5, 0]} rotation-x={-Math.PI / 2} scale={[30, 30, 1]} color="#0a1a42" />
    </Environment>
  )
}
