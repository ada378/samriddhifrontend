import HeroBanner from '../components/home/HeroBanner'
import CategoryGrid from '../components/home/CategoryGrid'
import FeaturedVendors from '../components/home/FeaturedVendors'
import FlashDeals from '../components/home/FlashDeals'
import SeasonalBanner from '../components/home/SeasonalBanner'
import LiveStats from '../components/home/LiveStats'
import BlogInsights from '../components/home/BlogInsights'
import Newsletter from '../components/home/Newsletter'
import TrustSignals from '../components/home/TrustSignals'
import RecentlyViewed from '../components/home/RecentlyViewed'

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <FlashDeals />
      <SeasonalBanner />
      <FeaturedVendors />
      <LiveStats />
      <TrustSignals />
      <BlogInsights />
      <RecentlyViewed />
      <Newsletter />
    </>
  )
}
