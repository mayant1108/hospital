import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { api } from '../hooks/useApi';
import { Stethoscope, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">HospitalMS</h1>
          <p className="text-gray-600 text-sm">Hospital Management System</p>
        </div>

        <Card>
          <Card.Header>
            <Card.Title>Welcome back</Card.Title>
            <Card.Description>
              Sign in to your account to continue
            </Card.Description>
          </Card.Header>

          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-4">

              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>

              <p className="text-sm text-center text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600">
                  Sign up
                </Link>
              </p>
            </form>

            {/* Demo */}
            <div className="mt-6 p-3 bg-blue-50 rounded text-xs">
              <p>Email: doctor@hospital.com</p>
              <p>Password: password123</p>
            </div>

          </Card.Content>
        </Card>

      </div>
    </div>
  );
};

export default Login;