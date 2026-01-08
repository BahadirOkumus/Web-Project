import { useEffect, useState } from 'react'
import http from '../api/http'
import type { Category, Product } from '../types'
import { Button, Spinner, Alert } from 'flowbite-react'
import ProductCard from '../components/ProductCard'

export default function Categories() {
  const [cats, setCats] = useState<Category[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loadingCats, setLoadingCats] = useState<boolean>(true)
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    void (async () => {
      try {
        const res = await http.get('/categories')
        setCats(res.data)
      } finally {
        setLoadingCats(false)
      }
    })()
  }, [])

  async function loadProducts(categoryId: number) {
    setSelected(categoryId)
    setLoadingProducts(true)
    setError('')
    try {
      const res = await http.get(`/categories/${categoryId}/products`)
      setProducts(res.data)
    } catch {
      setError('Ürünler yüklenemedi')
    } finally {
      setLoadingProducts(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">Kategoriler</h2>
        {loadingCats ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {cats.map((c) => (
              <Button key={c.id} color={selected === c.id ? 'blue' : 'gray'} onClick={() => loadProducts(c.id)}>
                {c.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold">{selected ? 'Ürünler' : 'Kategori seçiniz'}</h3>
        {error && <Alert color="failure">{error}</Alert>}
        {selected && (
          loadingProducts ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
