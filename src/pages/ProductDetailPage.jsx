import { useParams } from 'react-router-dom'
import ProductDetail from '../components/product/ProductDetail'

export default function ProductDetailPage() {
  const { slug } = useParams()
  return <ProductDetail productSlug={slug} />
}
