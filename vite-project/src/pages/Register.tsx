import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Label, TextInput, Spinner } from 'flowbite-react';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await register(name, email, password);
      setSuccess(true);
      setTimeout(() => nav('/'), 1000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Kayıt başarısız');
      } else {
        setError('Kayıt başarısız');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      {success && (
        <Alert color="success" icon={FaCheckCircle} className="mb-4">
          Kayıt başarılı. Yönlendiriliyor...
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}
      <Card>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Ad</Label>
            <TextInput id="name" placeholder="Ad" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="email">E-posta</Label>
            <TextInput id="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
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
            Kayıt Ol
          </Button>
          <div className="text-sm text-gray-600">
            Zaten hesabın var mı? <Link to="/login" className="text-blue-600">Giriş Yap</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
