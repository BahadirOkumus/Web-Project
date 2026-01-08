import { useEffect, useState, useCallback } from 'react';
import http from '../../api/http';
import axios from 'axios';
import type { Product } from '../../types';
import Modal from '../../components/Modal';
import AdminTable from '../../components/AdminTable';
import CategoryMultiSelect from '../../components/CategoryMultiSelect';
import { useNavigate } from 'react-router-dom';
import { Button, Label, TextInput, Textarea, Card, FileInput } from 'flowbite-react';
import { HiPlus } from 'react-icons/hi';

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const nav = useNavigate();

  const load = useCallback(async () => {
    try {
      const res = await http.get('/admin/products');
      setItems(res.data);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) nav('/login');
    }
  }, [nav]);

  useEffect(() => {
    void load();
  }, [load]);

  function newItem() {
    setEditing(null);
    setName('');
    setPrice(0);
    setStock(0);
    setDescription('');
    setImageUrl('');
    setCategoryIds([]);
    setOpen(true);
  }

  function editItem(p: Product) {
    setEditing(p);
    setName(p.name);
    setPrice(p.price);
    setStock(p.stock);
    setDescription(p.description);
    setImageUrl(p.imageUrl);
    setCategoryIds((p.categories ?? []).map((c) => c.id));
    setOpen(true);
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await http.post('/admin/products/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImageUrl(res.data.url as string);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) nav('/login');
    }
  }

  async function save() {
    try {
      if (!editing) {
        const res = await http.post('/admin/products', { name, price, stock, description, imageUrl });
        const id = res.data.id as number;
        await http.patch(`/admin/products/${id}/categories`, { categoryIds });
      } else {
        await http.patch(`/admin/products/${editing.id}`, { name, price, stock, description, imageUrl });
        await http.patch(`/admin/products/${editing.id}/categories`, { categoryIds });
      }
      setOpen(false);
      await load();
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) nav('/login');
    }
  }

  async function remove(id: number) {
    try {
      await http.delete(`/admin/products/${id}`);
      await load();
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) nav('/login');
    }
  }

  const headers = ['ID', 'Ad', 'Fiyat', 'Stok', 'Kategoriler', 'Aksiyon'];
  const rows = items.map((p) => [
    p.id,
    p.name,
    p.price,
    p.stock,
    (p.categories ?? []).map((c) => c.name).join(', '),
    (
      <div className="flex gap-2">
        <Button size="xs" color="blue" onClick={() => editItem(p)}>Düzenle</Button>
        <Button size="xs" color="failure" onClick={() => remove(p.id)}>Sil</Button>
      </div>
    ),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Ürün Yönetimi</h2>
        <Button color="blue" onClick={newItem}>
          <HiPlus className="mr-2 h-4 w-4" />
          Ürün Ekle
        </Button>
      </div>
      <Card>
        <AdminTable headers={headers} rows={rows} />
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Ürünü Düzenle' : 'Yeni Ürün'}>
        <div className="grid gap-3">
          <div>
            <Label htmlFor="name">Ad</Label>
            <TextInput id="name" placeholder="Ad" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="price">Fiyat</Label>
              <TextInput id="price" type="number" placeholder="Fiyat" value={String(price)} onChange={(e) => setPrice(Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="stock">Stok</Label>
              <TextInput id="stock" type="number" placeholder="Stok" value={String(stock)} onChange={(e) => setStock(Number(e.target.value))} />
            </div>
          </div>
          <div>
            <Label htmlFor="image">Ürün Görseli</Label>
            <div className="flex items-center gap-3">
              <FileInput id="image" onChange={onFileChange} />
              {imageUrl && (
                <img src={imageUrl.startsWith('/') ? (http.defaults.baseURL?.replace(/\/$/, '') ?? '') + imageUrl : imageUrl} alt="preview" className="h-12 w-12 object-cover rounded" />
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="description">Açıklama</Label>
            <Textarea id="description" placeholder="Açıklama" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div>
            <div className="mb-2 font-medium">Kategoriler</div>
            <CategoryMultiSelect value={categoryIds} onChange={setCategoryIds} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button color="blue" onClick={save}>Kaydet</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
