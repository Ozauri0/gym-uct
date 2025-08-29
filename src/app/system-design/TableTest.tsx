'use client'

import { Table, ColumnDefinition } from '@/shared/ui'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  joinDate: string
}

const TableTest = () => {
  const users: User[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@email.com',
      role: 'Administrador',
      status: 'active',
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria@email.com',
      role: 'Entrenador',
      status: 'active',
      joinDate: '2024-02-20'
    },
    {
      id: 3,
      name: 'Carlos López',
      email: 'carlos@email.com',
      role: 'Cliente',
      status: 'inactive',
      joinDate: '2024-03-10'
    },
    {
      id: 4,
      name: 'Ana Rodríguez',
      email: 'ana@email.com',
      role: 'Cliente',
      status: 'active',
      joinDate: '2024-04-05'
    },
  ]

  const columns: ColumnDefinition<User>[] = [
    {
      key: 'name',
      header: 'Nombre',
      width: '25%'
    },
    {
      key: 'email',
      header: 'Email',
      width: '25%'
    },
    {
      key: 'role',
      header: 'Rol',
      align: 'center',
      width: '15%'
    },
    {
      key: 'status',
      header: 'Estado',
      align: 'center',
      width: '15%',
      render: (user) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
          }`}>
          {user.status === 'active' ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'joinDate',
      header: 'Fecha de Ingreso',
      align: 'center',
      width: '20%',
      render: (user) => new Date(user.joinDate).toLocaleDateString('es-ES')
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tabla de Usuarios - Gym UCT</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table
            data={users}
            columns={columns}
            keyExtractor={(user) => user.id.toString()}
            striped={true}
            hover={true}
            size="md"
            className="w-full"
          />
        </div>

        {/* Tabla con datos vacíos */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tabla Vacía</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table
              data={[]}
              columns={columns}
              keyExtractor={(user) => user.id.toString()}
              emptyMessage="No hay usuarios registrados"
              striped={true}
              hover={true}
            />
          </div>
        </div>

        {/* Diferentes tamaños */}
        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Diferentes Tamaños</h2>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Small</h3>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table
                data={users.slice(0, 2)}
                columns={columns}
                keyExtractor={(user) => user.id.toString()}
                size="sm"
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Large</h3>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table
                data={users.slice(0, 2)}
                columns={columns}
                keyExtractor={(user) => user.id.toString()}
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableTest