import Link from 'next/link';
import { logoutAction } from '@/lib/actions';
import { getCurrentSession } from '@/lib/auth';

export async function DashboardHeader() {
  const session = await getCurrentSession();
  return (
    <header className="dashboard-header">
      <div className="logo-title">
        {/* Replace with actual logo image if available */}
        <span className="logo">🛠️</span>
        <h1 className="title">Admin Dashboard</h1>
      </div>
      <div className="user-controls">
        {session && (
          <span className="user-name">{session.displayName || session.email}</span>
        )}
        <form action={logoutAction} style={{ display: 'inline' }}>
          <button type="submit" className="btn btn-outline logout-btn">
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
