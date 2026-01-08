import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarToggle, NavbarLink, NavbarCollapse, Dropdown, DropdownHeader, DropdownItem, DropdownDivider, Avatar, Badge } from 'flowbite-react';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';
import { FaStore } from 'react-icons/fa';

export default function Layout() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const nav = useNavigate();
  function onLogout() {
    logout();
    nav('/');
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar fluid rounded className="border-b">
        <NavbarBrand href="/" onClick={(e) => { e.preventDefault(); nav('/'); }}>
          <FaStore className="mr-2 h-6 w-6" />
          <span className="self-center whitespace-nowrap text-xl font-semibold">TekMarket</span>
        </NavbarBrand>
        <div className="flex md:order-2 items-center gap-4">
          {user ? (
            <Dropdown
              arrowIcon={true}
              inline
              label={<Avatar rounded>
                <span className="sr-only">Kullanıcı menüsü</span>
              </Avatar>}
            >
              <DropdownHeader>
                <span className="block text-sm">{user.name}</span>
                <span className="block truncate text-sm font-medium">{user.email}</span>
              </DropdownHeader>
              {user.role === 'ADMIN' && (
                <>
                  <DropdownItem as={Link} to="/admin/products">Ürün Yönetimi</DropdownItem>
                  <DropdownItem as={Link} to="/admin/categories">Kategori Yönetimi</DropdownItem>
                  <DropdownItem as={Link} to="/admin/users">Kullanıcı Yönetimi</DropdownItem>
                  <DropdownDivider />
                </>
              )}
              <DropdownItem onClick={onLogout}>Çıkış Yap</DropdownItem>
            </Dropdown>
          ) : (
            <div className="flex gap-2">
              <Link className="text-sm font-medium" to="/login">Giriş Yap</Link>
              <Link className="text-sm font-medium" to="/register">Kayıt Ol</Link>
            </div>
          )}
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink href="/" onClick={(e) => { e.preventDefault(); nav('/'); }}>Ana Sayfa</NavbarLink>
          <NavbarLink href="/products" onClick={(e) => { e.preventDefault(); nav('/products'); }}>Ürünler</NavbarLink>
          <NavbarLink href="/categories" onClick={(e) => { e.preventDefault(); nav('/categories'); }}>Kategoriler</NavbarLink>
          <NavbarLink href="/cart" onClick={(e) => { e.preventDefault(); nav('/cart'); }} className="flex items-center gap-2">Sepet <Badge color="info">{items.length}</Badge></NavbarLink>
        </NavbarCollapse>
      </Navbar>
      <main className="container mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
