import { useDocumentTitle } from '../hooks/useMedia'
import Button from '../components/Button'

export default function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <section className="flex min-h-[100svh] flex-col items-center justify-center bg-midnight px-5 text-center">
      <p className="serif-accent text-[clamp(6rem,25vw,16rem)] leading-none text-silver-grad">404</p>
      <h1 className="font-display mt-4 text-4xl font-extrabold">This page got washed away.</h1>
      <Button to="/" className="mt-10">Back home</Button>
    </section>
  )
}
