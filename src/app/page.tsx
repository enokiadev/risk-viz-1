import { Inter } from 'next/font/google'
import RiskMap from '../../components/RiskMap'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div>
      <RiskMap />
    </div>
  )
}
