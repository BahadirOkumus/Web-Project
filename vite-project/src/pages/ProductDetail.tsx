import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import http from '../api/http';
import axios from 'axios';
import type { Product, Review } from '../types';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import { Badge, Button, Card, Accordion, AccordionPanel, AccordionTitle, AccordionContent, Toast } from 'flowbite-react';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { user } = useAuth();
  const nav = useNavigate();
  const { add } = useCart();
  const [loginWarn, setLoginWarn] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await http.get(`/products/${id}`);
      setProduct(res.data);
      const rev = await http.get(`/products/${id}/reviews`);
      setReviews(rev.data);
    })();
  }, [id]);

  async function addReview(data: { rating: number; comment: string }) {
    try {
      await http.post('/reviews', { productId: Number(id), rating: data.rating, comment: data.comment });
      const rev = await http.get(`/products/${id}/reviews`);
      setReviews(rev.data);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) nav('/login');
    }
  }

  async function deleteReview(reviewId: number) {
    try {
      await http.delete(`/reviews/${reviewId}`);
      const rev = await http.get(`/products/${id}/reviews`);
      setReviews(rev.data);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) nav('/login');
    }
  }

  if (!product) return null;
  const base = http.defaults.baseURL?.replace(/\/$/, '') ?? '';
  const imgSrc = product.imageUrl ? (product.imageUrl.startsWith('/') ? `${base}${product.imageUrl}` : product.imageUrl) : 'https://via.placeholder.com/1200x800?text=Product';
  return (
    <div className="space-y-6">
      <Link to="/products" className="text-sm text-gray-600">← Ürünlere Dön</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <img
            src={imgSrc}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/1200x800?text=Product'
            }}
            className="w-full h-auto md:h-[420px] object-cover"
          />
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            <Badge color={product.stock > 0 ? 'success' : 'gray'} className="text-base px-3 py-1.5">
              {product.stock > 0 ? `Stok: ${product.stock}` : 'Stokta yok'}
            </Badge>
          </div>
          <div className="text-xl font-medium">₺{product.price}</div>
          <p className="text-gray-700">{product.description}</p>
          <Button
            className="mt-4"
            disabled={product.stock <= 0}
            onClick={() => {
              if (!user) {
                setLoginWarn(true);
                window.setTimeout(() => setLoginWarn(false), 2500);
                return;
              }
              add(product!, 1);
            }}
          >
            Sepete Ekle
          </Button>
          {loginWarn && (
            <div className="fixed top-4 right-4 z-50">
              <Toast>
                <div className="ml-3 text-sm font-normal">Lütfen giriş yapın</div>
              </Toast>
            </div>
          )}
        </Card>
      </div>
      <Accordion>
        <AccordionPanel>
          <AccordionTitle>Yorumlar</AccordionTitle>
          <AccordionContent>
            <div className="space-y-4">
              <ReviewList reviews={reviews} canDelete={user?.role === 'ADMIN'} onDelete={deleteReview} />
              <ReviewForm onSubmit={addReview} disabled={!user} />
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  );
}
