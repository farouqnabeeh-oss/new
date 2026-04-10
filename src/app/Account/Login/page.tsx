import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";

type LoginPageProps = {
  searchParams: Promise<{
    returnUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getCurrentSession();
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "ar";
  const isAr = lang === "ar";

  if (session) {
    redirect("/Admin");
  }

  const params = await searchParams;
  const returnUrl = params.returnUrl ?? "/Admin";

  return (
    <div className="uptown-login-portal">
      <style>{`
        .uptown-login-portal {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url('/images/panar1.jpeg') center/cover no-repeat;
          position: relative;
          font-family: 'Tajawal', sans-serif;
          overflow: hidden;
        }
        .uptown-login-portal::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%);
          backdrop-filter: blur(8px);
        }
        .login-card-container {
          position: relative;
          width: 100%;
          max-width: 450px;
          padding: 20px;
          z-index: 10;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(25px) saturate(180%);
          -webkit-backdrop-filter: blur(25px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 40px;
          padding: 50px 40px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          text-align: center;
        }
        .login-logo {
          font-size: 2.5rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .logo-accent { color: #E31E24; }
        .login-subtitle {
          color: rgba(255,255,255,0.6);
          font-size: 0.9rem;
          margin-bottom: 40px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .back-to-store {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 0.9rem;
          margin-top: 30px;
          transition: 0.3s;
        }
        .back-to-store:hover { color: #fff; }
      `}</style>

      <div className="login-card-container">
        <div className="glass-card">
          <div className="login-logo">
            UP<span className="logo-accent">TOWN</span>
          </div>
          <p className="login-subtitle">{isAr ? "بوابة الإدارة" : "Administration Portal"}</p>
          
          <LoginForm returnUrl={returnUrl} />

          <a href="/" className="back-to-store">
            <span>{isAr ? "العودة للمتجر" : "Back to Store"}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </a>
        </div>
      </div>
    </div>
  );
}
