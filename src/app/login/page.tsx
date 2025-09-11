
'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setToken('');
    const res = await fetch('/interface/http/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) setToken(data.token);
    else setError(data.error || 'Login fallido');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-blue-600"
              />
              Recordarme
            </label>
            <a href="#" className="hover:underline">¿Olvidaste tu contraseña?</a>
          </div>
          <button type="submit" className="bg-blue-600 text-white rounded p-3 font-semibold text-lg shadow hover:bg-blue-700 transition">
            Iniciar sesión
          </button>
          {error && <div className="text-red-600 text-center text-sm">{error}</div>}
          {token && <div className="text-green-600 break-all text-xs">Token: {token}</div>}
        </form>
        <div className="mt-4 text-center text-sm">
          <span>¿No tienes cuenta? </span>
          <a href="#" className="text-blue-600 hover:underline">Registrarse</a>
        </div>
      </div>
    </div>
  );
}
