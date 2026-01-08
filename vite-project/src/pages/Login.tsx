import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Label, TextInput, Spinner } from 'flowbite-react';
import axios from 'axios';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      nav('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Giriş başarısız');
      } else {
        setError('Giriş başarısız');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}
      <Card>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">E-posta</Label>
            <TextInput id="email" placeholder="E-posta" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Şifre</Label>
            <div className="flex gap-2">
              <TextInput id="password" placeholder="Şifre" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Button color="gray" type="button" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? 'Gizle' : 'Göster'}
              </Button>
            </div>
          </div>
          <Button type="submit" color="blue" disabled={loading}>
            {loading && <Spinner size="sm" className="mr-2" />}
            Giriş Yap
          </Button>
          <div className="text-sm text-gray-600">
            Hesabın yok mu? <Link to="/register" className="text-blue-600">Kayıt Ol</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
