import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json();

    // Validar entrada
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Llamar al backend Express con arquitectura hexagonal
    const response = await fetch(`${process.env.API_BASE_URL || 'http://backend:3001'}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.error || 'Error en autenticación' },
        { status: response.status }
      );
    }

    // Configurar respuesta exitosa
    const responseData = NextResponse.json({
      success: true,
      user: result.user,
      tokens: result.tokens
    });

    // Si rememberMe, configurar cookie con refresh token
    if (rememberMe && result.tokens?.refreshToken) {
      responseData.cookies.set('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 días
        path: '/'
      });
    }

    return responseData;

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
