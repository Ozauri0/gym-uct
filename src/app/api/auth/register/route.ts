import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, rut, carrera, password, role = 'alumno' } = await request.json();

    // Validar campos requeridos
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Llamar al backend Express con arquitectura hexagonal
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:5000'}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.error || 'Error en registro' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      message: 'Usuario registrado exitosamente'
    }, { status: 201 });

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
