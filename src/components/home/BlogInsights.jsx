import { useNavigate } from 'react-router-dom'
import Card from '../common/Card'
import Button from '../common/Button'

const articles = [
  {
    id: 1,
    title: 'Health Benefits of Rock Salt vs Table Salt',
    excerpt: 'Discover why Himalayan pink salt and Sendha Namak are considered healthier alternatives to refined table salt in Ayurveda.',
    image: 'https://placehold.co/400x250/1D9E75/FFFFFF?text=Health+Benefits',
    readTime: '4 min read',
  },
  {
    id: 2,
    title: 'Behind the Scenes: A Day at Tata Salt Plant',
    excerpt: 'We take you inside India\'s most advanced salt processing facility to show how your table salt is made.',
    image: 'https://placehold.co/400x250/CC0C2C/FFFFFF?text=Vendor+Spotlight',
    readTime: '6 min read',
  },
  {
    id: 3,
    title: 'Salt Industry 2026: Trends & Price Outlook',
    excerpt: 'From organic certification trends to bulk pricing forecasts, here\'s what salt buyers need to know this year.',
    image: 'https://placehold.co/400x250/1A1A2E/FFFFFF?text=Industry+News',
    readTime: '5 min read',
  },
]

export default function BlogInsights() {
  const navigate = useNavigate()

  return (
    <section className="section" style={{ background: 'var(--bg-warm)' }}>
      <div className="container">
        <h2 className="section-title">Salt Insights & News</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {articles.map(article => (
            <Card key={article.id} hover padding="0" style={{ overflow: 'hidden' }}>
              <div style={{ aspectRatio: '16/10', background: 'var(--bg-gray)', overflow: 'hidden' }}>
                <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              <div style={{ padding: 16 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{article.readTime}</span>
                <h4 style={{ fontSize: '1rem', margin: '6px 0 8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.title}</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.excerpt}</p>
                <Button variant="ghost" size="sm" onClick={() => navigate('/')} style={{ padding: 0, color: 'var(--primary)', fontWeight: 600 }}>
                  Read More →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          section .container > div { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          section .container > div { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          section .container > div .card { max-width: 100% !important; }
        }
      `}</style>
    </section>
  )
}
