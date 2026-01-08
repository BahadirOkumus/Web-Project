import { useEffect, useState } from 'react'
import http from '../api/http'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'
import { Button, Card, Spinner } from 'flowbite-react'
import { Link } from 'react-router-dom'

export default function Home() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    void (async () => {
      try {
        const res = await http.get('/products')
        setItems(res.data)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const popular = items.slice(0, 4)

  return (
    <div className="space-y-10">
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">TekMarket</h1>
            <p className="text-gray-600">Popüler ürünleri keşfedin ve fırsatları yakalayın</p>
          </div>
          <div className="flex gap-3">
            <Button as={Link} to="/products">Tüm Ürünler</Button>
            <Button color="gray" as={Link} to="/categories">Kategoriler</Button>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">Beğenebileceğiniz Ürünler</h2>
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popular.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
