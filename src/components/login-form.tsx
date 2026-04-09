"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions";

type LoginFormProps = {
  returnUrl: string;
};

export function LoginForm({ returnUrl }: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="uptown-login-form">
      <style>{`
        .uptown-login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .login-input-group {
          text-align: right;
        }
        .login-label {
          display: block;
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem;
          margin-bottom: 8px;
          margin-right: 15px;
        }
        .login-input-field {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 15px 25px;
          color: #fff;
          font-size: 1rem;
          transition: 0.3s;
          outline: none;
          text-align: inherit;
        }
        .login-input-field:focus {
          background: rgba(255,255,255,0.1);
          border-color: #E31E24;
          box-shadow: 0 0 20px rgba(227, 30, 36, 0.2);
        }
        .login-submit-btn {
          background: linear-gradient(135deg, #E31E24 0%, #a1151a 100%);
          color: #fff;
          border: none;
          border-radius: 20px;
          padding: 16px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 10px;
          box-shadow: 0 10px 20px rgba(227, 30, 36, 0.3);
        }
        .login-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(227, 30, 36, 0.4);
        }
        .login-error-msg {
          background: rgba(227, 30, 36, 0.1);
          border: 1px solid rgba(227, 30, 36, 0.2);
          color: #ff9ea1;
          padding: 12px;
          border-radius: 15px;
          font-size: 0.85rem;
          margin-bottom: 10px;
        }
      `}</style>

      <input type="hidden" name="returnUrl" value={returnUrl} />
      
      <div className="login-input-group">
        <label className="login-label">اسم المستخدم</label>
        <input 
          type="text" 
          name="username" 
          defaultValue="admin"
          placeholder="admin" 
          required 
          className="login-input-field"
        />
      </div>

      <div className="login-input-group">
        <label className="login-label">كلمة المرور</label>
        <input 
          type="password" 
          name="password" 
          placeholder="••••••••" 
          required 
          autoComplete="current-password" 
          className="login-input-field"
        />
      </div>

      {state?.error ? (
        <div className="login-error-msg">
          <span>{state.error}</span>
        </div>
      ) : null}

      <button type="submit" className="login-submit-btn">
        تسجيل الدخول
      </button>
    </form>
  );
}
