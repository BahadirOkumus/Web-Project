import { useRef, useState } from 'react';
import { useCart } from '../cart/CartContext';
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Button, Card, Alert } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiTrash } from 'react-icons/hi';

export default function Cart() {
  const { items, inc, dec, remove, clear } = useCart();
  const [error, setError] = useState('');
  const timerRef = useRef<number | null>(null);
  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  function handleInc(id: number) {
    const ok = inc(id);
    if (!ok) {
      setError('Stok yeterli değil');
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setError(''), 2500);
    }
  }
  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <Alert color="info">Sepetiniz boş</Alert>
        <Button as={Link} to="/products">Ürünlere Git</Button>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {error && <Alert color="failure" className="mb-3">{error}</Alert>}
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Ürün</TableHeadCell>
              <TableHeadCell>Fiyat</TableHeadCell>
              <TableHeadCell>Adet</TableHeadCell>
              <TableHeadCell>Ara Toplam</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Actions</span>
              </TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {items.map((i) => (
              <TableRow key={i.product.id} className="bg-white">
                <TableCell className="font-medium text-gray-900">{i.product.name}</TableCell>
                <TableCell>₺{i.product.price}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button color="gray" size="xs" onClick={() => dec(i.product.id)}>-</Button>
                    <span>{i.qty}</span>
                    <Button color="gray" size="xs" onClick={() => handleInc(i.product.id)} disabled={i.qty >= i.product.stock}>+</Button>
                  </div>
                </TableCell>
                <TableCell>₺{(i.product.price * i.qty).toFixed(2)}</TableCell>
                <TableCell>
                  <Button color="failure" size="xs" onClick={() => remove(i.product.id)}>
                    <HiTrash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <Card>
          <h3 className="text-lg font-semibold">Sipariş Özeti</h3>
          <div className="flex justify-between"><span>Toplam ürün</span><span>{count}</span></div>
          <div className="flex justify-between"><span>Toplam tutar</span><span>₺{total.toFixed(2)}</span></div>
          <div className="flex justify-end">
            <Button color="gray" onClick={clear}>Sepeti Temizle</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
