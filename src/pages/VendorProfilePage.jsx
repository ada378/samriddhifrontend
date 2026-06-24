import { useParams } from 'react-router-dom'
import VendorProfile from '../components/vendor/VendorProfile'

export default function VendorProfilePage() {
  const { slug } = useParams()
  return <VendorProfile vendorSlug={slug} />
}
