import { useEffect, useState, useMemo } from 'react';
import http from '../api/http';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { TextInput, Spinner, Alert } from 'flowbite-react';
import { HiSearch } from 'react-icons/hi';

export default function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [q, setQ] = useState('');
  useEffect(() => {
    void (async () => {
      try {
        const res = await http.get('/products');
        setItems(res.data);
      } catch {
        setError('Ürünler yüklenemedi');
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const filtered = useMemo(() => items.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())), [items, q]);
  if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Ürünler</h2>
          <p className="text-sm text-gray-600">TekMarket ürün kataloğu</p>
        </div>
        <div className="w-64">
          <TextInput icon={HiSearch} placeholder="Ara" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      {error && <Alert color="failure">{error}</Alert>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
