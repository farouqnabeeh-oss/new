import React from 'react';

type Props = {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: string;
};

export function StatCard({ title, value, icon, trend, color = 'var(--primary)' }: Props) {
  return (
    <div className="stat-card" style={{ '--accent-color': color } as React.CSSProperties}>
      <div className="stat-card-inner">
        <div className="stat-info">
          <p className="stat-title">{title}</p>
          <h3 className="stat-value">{value}</h3>
          {trend && (
            <div className={`stat-trend ${trend.isUp ? 'up' : 'down'}`}>
              <span className="trend-icon">{trend.isUp ? '📈' : '📉'}</span>
              <span className="trend-value">{trend.isUp ? '+' : '-'}{trend.value}%</span>
              <span className="trend-label">vs last month</span>
            </div>
          )}
        </div>
        <div className="stat-icon-wrapper">
          <span className="stat-icon">{icon}</span>
        </div>
      </div>
      <div className="stat-card-progress">
        <div className="progress-bar" style={{ width: '70%' }}></div>
      </div>
    </div>
  );
}
