import { NextRequest, NextResponse } from 'next/server';
import { AuthServiceImpl } from '../../../../infrastructure/auth/AuthServiceImpl';
import { LoginUser } from '../../../../core/application/use-cases/LoginUser';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const useCase = new LoginUser(new AuthServiceImpl());
  const result = await useCase.execute(email, password);
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  return NextResponse.json({ token: result.token });
}
