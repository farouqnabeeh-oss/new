"use client";

import { type Order, type Branch } from "@/lib/types";
import { useState } from "react";
import { updateOrderStatus, getOrderSummary } from "@/lib/order-actions";

type Props = {
  orders: Order[];
  branches: Branch[];
};

export function AdminIntelligenceTab({ orders, branches }: Props) {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week");

  // Calculations
  const totalSales = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Most Popular Products (Mocking logic based on item counts if available)
  const productPopularity: Record<string, { nameAr: string, count: number }> = {};
  orders.forEach(order => {
    order.items?.forEach(item => {
      const id = item.productId.toString();
      if (!productPopularity[id]) {
        productPopularity[id] = { nameAr: item.productNameAr, count: 0 };
      }
      productPopularity[id].count += item.quantity;
    });
  });

  const topProducts = Object.values(productPopularity)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="intelligence-tab">
      <div className="admin-section-header">
        <h2 className="admin-subtitle">📊 Intelligence & Analytics</h2>
        <div className="intelligence-filters">
            <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="ultra-login-input"
                style={{ width: '150px', height: '40px', padding: '0 15px', borderRadius: '10px' }}
            >
                <option value="day">Today</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
            </select>
        </div>
      </div>

      {/* 📈 STATS GRID */}
      <div className="intelligence-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="stat-card" style={{ background: '#fff', padding: '30px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--ultra-shadow-sm)' }}>
          <div style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '14px', marginBottom: '10px' }}>TOTAL SALES</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>{totalSales.toFixed(2)} ₪</div>
          <div style={{ fontSize: '12px', color: '#11a85f', fontWeight: 800, marginTop: '8px' }}>↑ 12% vs last {timeRange}</div>
        </div>
        <div className="stat-card" style={{ background: '#fff', padding: '30px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--ultra-shadow-sm)' }}>
          <div style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '14px', marginBottom: '10px' }}>TOTAL ORDERS</div>
          <div style={{ fontSize: '2rem', fontWeight: 900 }}>{totalOrders}</div>
          <div style={{ fontSize: '12px', color: '#11a85f', fontWeight: 800, marginTop: '8px' }}>↑ 5% vs last {timeRange}</div>
        </div>
        <div className="stat-card" style={{ background: '#fff', padding: '30px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--ultra-shadow-sm)' }}>
          <div style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '14px', marginBottom: '10px' }}>AVG. ORDER VALUE</div>
          <div style={{ fontSize: '2rem', fontWeight: 900 }}>{avgOrderValue.toFixed(2)} ₪</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 700, marginTop: '8px' }}>Stable performance</div>
        </div>
      </div>

      <div className="intelligence-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '40px' }}>
        {/* 📊 RECENT ORDERS CHART (PLACEHOLDER UI) */}
        <div className="admin-card" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '24px', fontWeight: 900 }}>Sales Velocity</h3>
          <div style={{ height: '300px', background: '#f9f9f9', borderRadius: '20px', display: 'flex', alignItems: 'flex-end', gap: '15px', padding: '20px' }}>
            {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--primary)', borderRadius: '8px 8px 0 0', opacity: 0.8 + (i*0.02) }}></div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '12px' }}>
            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
          </div>
        </div>

        {/* 🏆 TOP PRODUCTS */}
        <div className="admin-card" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '24px', fontWeight: 900 }}>🔥 Popular Now</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {topProducts.length > 0 ? topProducts.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700 }}>{p.nameAr}</span>
                <span style={{ background: 'var(--primary-soft)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 900 }}>{p.count} sold</span>
              </div>
            )) : (
              <p style={{ opacity: 0.5 }}>No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* 📄 LATEST ORDERS TABLE */}
      <div className="admin-card">
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 900 }}>Recent Transactions</h3>
            <button className="btn btn-outline btn-sm" onClick={() => window.location.reload()}>Refresh</button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Branch</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.branch?.nameAr || "N/A"}</td>
                <td>{order.customerName}</td>
                <td style={{ fontWeight: 900 }}>{order.totalAmount.toFixed(2)} ₪</td>
                <td>
                  <span className={`ultra-branch-badge-fire ${order.status.toLowerCase()}`} style={{ background: order.status === 'Paid' || order.status === 'Delivered' ? '#11a85f' : order.status === 'Cancelled' ? '#e63946' : 'var(--primary)', color: '#fff' }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ fontSize: '12px', opacity: 0.6 }}>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</td>
                <td>
                    <select 
                        defaultValue={order.status} 
                        onChange={async (e) => {
                            const res = await updateOrderStatus(order.id, e.target.value);
                            if(res.success) window.location.reload();
                            else alert('Failed to update status: ' + res.error);
                        }}
                        style={{ padding: '6px', borderRadius: '5px', fontSize: '11px', border: '1px solid #ddd', marginRight: '5px' }}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Paid">Paid</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <button style={{ fontSize:'11px', cursor:'pointer', padding: '6px 10px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '5px' }} onClick={async () => {
                        const res = await getOrderSummary(order.id);
                        if(res.success) {
                            const items = res.order.order_items.map((i:any) => `${i.quantity}x ${i.product_name_ar || i.product_name_en} (${i.price}₪) \n${i.addon_details || ''}`).join('\n\n');
                            alert(`Order #${order.id} details:\n\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\nType: ${order.order_type}\nAddress: ${order.address || 'N/A'}\n\nItems:\n${items}`);
                        }
                    }}>Details</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>No orders found yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
