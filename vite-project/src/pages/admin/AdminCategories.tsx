import { useEffect, useState, useCallback } from 'react';
import http from '../../api/http';
import axios from 'axios';
import type { Category } from '../../types';
import Modal from '../../components/Modal';
import AdminTable from '../../components/AdminTable';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { HiPlus } from 'react-icons/hi';

export default function AdminCategories() {
  const [items, setItems] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const nav = useNavigate();

  const load = useCallback(async () => {
    try {
      const res = await http.get('/admin/categories');
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
    setOpen(true);
  }

  function editItem(c: Category) {
    setEditing(c);
    setName(c.name);
    setOpen(true);
  }

  async function save() {
    try {
      if (!editing) await http.post('/admin/categories', { name });
      else await http.patch(`/admin/categories/${editing.id}`, { name });
      setOpen(false);
      await load();
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) nav('/login');
    }
  }

  async function remove(id: number) {
    try {
      await http.delete(`/admin/categories/${id}`);
      await load();
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) nav('/login');
    }
  }

  const headers = ['ID', 'Ad', 'Aksiyon'];
  const rows = items.map((c) => [
    c.id,
    c.name,
    (
      <div className="flex gap-2">
        <Button size="xs" color="blue" onClick={() => editItem(c)}>Düzenle</Button>
        <Button size="xs" color="failure" onClick={() => remove(c.id)}>Sil</Button>
      </div>
    ),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Kategori Yönetimi</h2>
        <Button color="blue" onClick={newItem}>
          <HiPlus className="mr-2 h-4 w-4" />
          Kategori Ekle
        </Button>
      </div>
      <Card>
        <AdminTable headers={headers} rows={rows} />
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Kategori Düzenle' : 'Yeni Kategori'}>
        <div className="grid gap-3">
          <div>
            <Label htmlFor="name">Ad</Label>
            <TextInput id="name" placeholder="Ad" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button color="blue" onClick={save}>Kaydet</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
