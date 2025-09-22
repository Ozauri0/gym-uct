'use client';

import { ProtectedRoute } from '@/features/auth';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button, Badge, Input } from '@/shared/ui';
import { useState } from 'react';

const timeSlots = [
  { time: '08:00', available: 5, status: 'available' },
  { time: '09:00', available: 3, status: 'available' },
  { time: '10:00', available: 0, status: 'full' },
  { time: '11:00', available: 8, status: 'available' },
  { time: '12:00', available: 2, status: 'available' },
  { time: '13:00', available: 0, status: 'full' },
  { time: '14:00', available: 6, status: 'available' },
  { time: '15:00', available: 4, status: 'available' },
  { time: '16:00', available: 7, status: 'available' },
  { time: '17:00', available: 0, status: 'full' },
  { time: '18:00', available: 1, status: 'available' },
  { time: '19:00', available: 9, status: 'available' },
];

const userReservations = [
  {
    id: 1,
    room: 'Sala de Pesas',
    date: '22/9/2025',
    time: '14:00',
    status: 'confirmed'
  },
  {
    id: 2,
    room: 'Sala de Máquinas',
    date: '24/9/2025',
    time: '16:00',
    status: 'confirmed'
  }
];

const rooms = [
  { id: 'pesas', name: 'Sala de Pesas', available: 18, total: 25 },
  { id: 'maquinas', name: 'Sala de Máquinas', available: 12, total: 20 },
  { id: 'funcional', name: 'Entrenamiento Funcional', available: 8, total: 15 }
];

function MainContent() {
  const { user, logout } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedRoom, setSelectedRoom] = useState('pesas');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
  };

  const handleTimeSlotClick = (time: string, available: number) => {
    if (available > 0) {
      setSelectedTime(time);
    }
  };

  const handleReserve = () => {
    if (selectedTime) {
      alert(`Reserva creada para ${selectedTime} en ${rooms.find(r => r.id === selectedRoom)?.name}`);
      setSelectedTime(null);
    }
  };

  const reservationsCount = userReservations.length;
  const maxReservations = 2;
  const canReserve = reservationsCount < maxReservations;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Gym UCT</h1>
            </div>
            
            {/* User Info & Controls */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-600">Bienvenido,</p>
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Usuario'}</p>
              </div>
              <Badge variant="primary" size="sm">
                {user?.role || 'usuario'}
              </Badge>
              <Button variant="danger" size="sm" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Reservas</h2>
          <p className="text-gray-600">Reserva tu horario en el gimnasio. Máximo 2 reservas semanales de 1 hora cada una.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Reservas Activas */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reservas Activas</p>
                <p className="text-2xl font-bold text-gray-900">{reservationsCount}/{maxReservations}</p>
              </div>
            </div>
          </div>

          {/* Próxima Reserva */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Próxima Reserva</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userReservations.length > 0 ? `${userReservations[0].date} ${userReservations[0].time}` : 'Sin reservas'}
                </p>
              </div>
            </div>
          </div>

          {/* Cupos Disponibles */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cupos Disponibles Hoy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {timeSlots.reduce((acc, slot) => acc + slot.available, 0)} cupos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Selección */}
          <div className="lg:col-span-1 space-y-6">
            {/* Seleccionar Fecha y Sala */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Seleccionar Fecha y Sala</h3>
              
              {/* Fecha */}
              <div className="mb-6">
                <Input
                  type="date"
                  label="Fecha"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  fullWidth
                />
              </div>

              {/* Sala */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Sala</label>
                <div className="space-y-3">
                  {rooms.map((room) => (
                    <label key={room.id} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="radio" 
                        name="sala" 
                        value={room.id}
                        checked={selectedRoom === room.id}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500" 
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{room.name}</p>
                        <p className="text-xs text-gray-500">Disponibles: {room.available}/{room.total}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Mis Reservas */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Mis Reservas</h3>
              
              <div className="space-y-4">
                {userReservations.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No tienes reservas activas</p>
                ) : (
                  userReservations.map((reservation) => (
                    <div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">{reservation.room}</p>
                        <p className="text-sm text-gray-600">{reservation.date} a las {reservation.time}</p>
                        <div className="flex space-x-2 mt-2">
                          <button className="text-xs text-blue-600 hover:underline">Modificar</button>
                          <button className="text-xs text-red-600 hover:underline">Cancelar</button>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">
                        Confirmada
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Horarios */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-2 sm:space-y-0">
                <h3 className="text-xl font-semibold text-gray-900">Horarios Disponibles</h3>
                <p className="text-sm text-gray-600">
                  {selectedDate} - {rooms.find(r => r.id === selectedRoom)?.name}
                </p>
              </div>

              {/* Time Slots Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => handleTimeSlotClick(slot.time, slot.available)}
                    disabled={slot.available === 0 || !canReserve}
                    className={`p-4 rounded-xl transition-all duration-200 ${
                      slot.available === 0
                        ? 'bg-gray-100 border-2 border-gray-200 cursor-not-allowed'
                        : selectedTime === slot.time
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : canReserve
                        ? 'bg-green-50 border-2 border-green-200 hover:bg-green-100'
                        : 'bg-gray-100 border-2 border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <p className={`font-semibold ${
                      slot.available === 0 || !canReserve 
                        ? 'text-gray-500' 
                        : selectedTime === slot.time
                        ? 'text-blue-800'
                        : 'text-green-800'
                    }`}>
                      {slot.time}
                    </p>
                    <p className={`text-xs ${
                      slot.available === 0 
                        ? 'text-gray-400' 
                        : selectedTime === slot.time
                        ? 'text-blue-600'
                        : 'text-green-600'
                    }`}>
                      {slot.available === 0 ? 'Lleno' : `${slot.available} cupos`}
                    </p>
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center space-x-6 mb-6 gap-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-200 rounded"></div>
                  <span className="text-sm text-gray-600">Disponible</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span className="text-sm text-gray-600">Sin cupos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-200 rounded"></div>
                  <span className="text-sm text-gray-600">Seleccionado</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center">
                {canReserve ? (
                  selectedTime ? (
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={handleReserve}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      Confirmar Reserva para {selectedTime}
                    </Button>
                  ) : (
                    <Button 
                      variant="secondary" 
                      size="lg"
                      disabled
                    >
                      Selecciona un horario
                    </Button>
                  )
                ) : (
                  <div>
                    <Button 
                      variant="secondary" 
                      size="lg"
                      disabled
                      className="bg-gradient-to-r from-gray-400 to-gray-500"
                    >
                      Límite de reservas alcanzado
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">Cancela una reserva existente para crear una nueva</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <MainContent />
    </ProtectedRoute>
  );
}
