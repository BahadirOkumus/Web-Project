import { useEffect, useState, useCallback } from 'react';
import http from '../../api/http';
import axios from 'axios';
import type { User, Role } from '../../types';
import AdminTable from '../../components/AdminTable';
import Modal from '../../components/Modal';
import { Button, Card, Badge, Toast, Select } from 'flowbite-react';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export default function AdminUsers() {
  const [items, setItems] = useState<User[]>([]);
  const nav = useNavigate();
  const { user: me } = useAuth();
  const [toasts, setToasts] = useState<{ id: number; type: 'success' | 'failure'; message: string }[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await http.get('/admin/users');
      setItems(res.data);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 401) nav('/login');
        if (e.response?.status === 403) nav('/');
      }
    }
  }, [nav]);

  useEffect(() => {
    void load();
  }, [load]);

  async function setRole(id: number, role: Role) {
    setUpdatingId(id);
    try {
      await http.patch(`/admin/users/${id}/role`, { role });
      addToast('success', 'Rol güncellendi');
      await load();
    } catch (e) {
      addToast('failure', axios.isAxiosError(e) ? (e.response?.data?.message ?? 'Güncelleme başarısız') : 'Güncelleme başarısız');
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 401) nav('/login');
        if (e.response?.status === 403) nav('/');
      }
    } finally {
      setUpdatingId(null);
    }
  }

  function addToast(type: 'success' | 'failure', message: string) {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
  }

  async function deleteUser(id: number) {
    try {
      await http.delete(`/admin/users/${id}`);
      addToast('success', 'Kullanıcı silindi');
      await load();
    } catch (e) {
      addToast('failure', axios.isAxiosError(e) ? (e.response?.data?.message ?? 'Silme başarısız') : 'Silme başarısız');
      if (axios.isAxiosError(e) && e.response?.status === 401) nav('/login');
    }
  }

  function openConfirm(id: number) {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (pendingDeleteId == null) return;
    setConfirmOpen(false);
    await deleteUser(pendingDeleteId);
    setPendingDeleteId(null);
  }

  const headers = ['ID', 'Ad', 'Email', 'Rol', 'Aksiyon'];
  const rows = items.map((u) => [
    u.id,
    u.name,
    u.email,
    <Badge key={`role-${u.id}`} color={u.role === 'ADMIN' ? 'success' : 'gray'}>{u.role === 'ADMIN' ? 'Admin' : 'Müşteri'}</Badge>,
    (
      <div className="flex gap-2" key={`act-${u.id}`}>
        <Select
          value={u.role}
          sizing="sm"
          disabled={updatingId === u.id}
          onChange={(e) => {
            const next = e.target.value as Role;
            if (next === 'CUSTOMER' && me?.id === u.id && u.role === 'ADMIN') return;
            void setRole(u.id, next);
          }}
        >
          <option value="ADMIN">Admin</option>
          <option value="CUSTOMER" disabled={me?.id === u.id && u.role === 'ADMIN'}>Müşteri</option>
        </Select>
        <Button size="xs" color="failure" onClick={() => openConfirm(u.id)}>Sil</Button>
      </div>
    ),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Kullanıcı Yönetimi</h2>
      </div>
      <Card>
        <AdminTable headers={headers} rows={rows} />
      </Card>
      <Modal open={confirmOpen} title="Emin misiniz?" onClose={() => setConfirmOpen(false)}>
        <p>Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
        {pendingDeleteId != null && (
          <p className="text-sm text-gray-600">Silinecek kullanıcı: {items.find((i) => i.id === pendingDeleteId)?.email}</p>
        )}
        <div className="flex justify-end gap-2">
          <Button color="gray" onClick={() => setConfirmOpen(false)}>İptal</Button>
          <Button color="failure" onClick={confirmDelete}>Evet, sil</Button>
        </div>
      </Modal>
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <Toast key={t.id}>
            <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${t.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <FaCheckCircle />
            </div>
            <div className="ml-3 text-sm font-normal">{t.message}</div>
          </Toast>
        ))}
      </div>
    </div>
  );
}
