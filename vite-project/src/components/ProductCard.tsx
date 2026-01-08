import { useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../api/http';
import type { Product } from '../types';
import { useCart } from '../cart/CartContext';
import { Card, Badge, Button, Toast } from 'flowbite-react';
import { useAuth } from '../auth/AuthContext';

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { user } = useAuth();
  const [loginWarn, setLoginWarn] = useState(false);
  const disabled = product.stock <= 0;
  const placeholder = 'https://via.placeholder.com/600x400?text=Product';
  const base = http.defaults.baseURL?.replace(/\/$/, '') ?? '';
  const src = product.imageUrl ? (product.imageUrl.startsWith('/') ? `${base}${product.imageUrl}` : product.imageUrl) : placeholder;
  return (
    <Card className="shadow-sm overflow-hidden">
      <Link to={`/products/${product.id}`} className="block">
        <img
          src={src}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = placeholder;
          }}
          className="h-48 w-full object-cover"
        />
      </Link>
      <div className="flex items-center justify-between">
        <Link to={`/products/${product.id}`} className="hover:underline">
          <h5 className="text-lg font-semibold tracking-tight text-gray-900">{product.name}</h5>
        </Link>
        <Badge color={product.stock > 0 ? 'success' : 'gray'}>{product.stock > 0 ? `Stok: ${product.stock}` : 'Stokta yok'}</Badge>
      </div>
      <p className="text-gray-700">₺{product.price}</p>
      <div className="flex gap-2">
        <Button color="gray" as={Link} to={`/products/${product.id}`}>Detay</Button>
        <Button
          color={disabled ? 'gray' : 'blue'}
          disabled={disabled}
          onClick={() => {
            if (!user) {
              setLoginWarn(true);
              window.setTimeout(() => setLoginWarn(false), 2500);
              return;
            }
            add(product, 1);
          }}
        >
          Sepete Ekle
        </Button>
      </div>
      {loginWarn && (
        <div className="fixed top-4 right-4 z-50">
          <Toast>
            <div className="ml-3 text-sm font-normal">Lütfen giriş yapın</div>
          </Toast>
        </div>
      )}
    </Card>
  );
}
