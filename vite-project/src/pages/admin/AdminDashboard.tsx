import { Card, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Yönetim Paneli</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h5 className="text-xl font-semibold">Ürün Yönetimi</h5>
          <p className="text-gray-600">Ürünleri listele, ekle, düzenle veya sil.</p>
          <Button as={Link} to="/admin/products" color="blue">Git</Button>
        </Card>
        <Card>
          <h5 className="text-xl font-semibold">Kategori Yönetimi</h5>
          <p className="text-gray-600">Kategorileri listele, ekle, düzenle veya sil.</p>
          <Button as={Link} to="/admin/categories" color="blue">Git</Button>
        </Card>
        <Card>
          <h5 className="text-xl font-semibold">Kullanıcı Yönetimi</h5>
          <p className="text-gray-600">Kullanıcı rolleri: admin yap/kaldır.</p>
          <Button as={Link} to="/admin/users" color="blue">Git</Button>
        </Card>
      </div>
    </div>
  );
}
