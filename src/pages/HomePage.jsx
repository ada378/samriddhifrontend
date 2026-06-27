import HeroBanner from '../components/home/HeroBanner'
import FeaturedProducts from '../components/home/FeaturedProducts'
import FlashDeals from '../components/home/FlashDeals'
import CategoryGrid from '../components/home/CategoryGrid'
import FeaturedVendors from '../components/home/FeaturedVendors'
import SeasonalBanner from '../components/home/SeasonalBanner'
import LiveStats from '../components/home/LiveStats'
import TrustSignals from '../components/home/TrustSignals'
import BlogInsights from '../components/home/BlogInsights'
import Newsletter from '../components/home/Newsletter'
import RecentlyViewed from '../components/home/RecentlyViewed'
import OurValues from '../components/home/OurValues'

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FlashDeals />
      <LiveStats />
      <FeaturedProducts />
      <OurValues />
      <CategoryGrid />
      <SeasonalBanner />
      <FeaturedVendors />
      <TrustSignals />
      <BlogInsights />
      <RecentlyViewed />
      <Newsletter />
    </>
  )
}
