import { AuthGuard } from '@/features/auth/guards/AuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="admin">
      {children}
    </AuthGuard>
  );
}
