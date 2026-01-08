import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';

export default function Header() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { items } = useCart();
  function onLogout() {
    logout();
    nav('/');
  }
  return (
    <header style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #ddd' }}>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/categories">Categories</Link>
      <Link to="/cart">Cart ({items.length})</Link>
      {user ? (
        <>
          <span>Hi, {user.name}</span>
          {user.role === 'ADMIN' && <Link to="/admin/products">Admin Products</Link>}
          {user.role === 'ADMIN' && <Link to="/admin/categories">Admin Categories</Link>}
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </header>
  );
}
