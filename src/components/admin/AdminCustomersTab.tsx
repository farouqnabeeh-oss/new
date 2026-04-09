"use client";

import { type Customer } from "@/lib/types";
import { useState } from "react";

type Props = {
  customers: Customer[];
};

export function AdminCustomersTab({ customers }: Props) {
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="customers-tab">
      <div className="admin-section-header">
        <h2 className="admin-subtitle">👥 Customer Management</h2>
        <div className="customer-actions" style={{ display: 'flex', gap: '15px' }}>
            <div className="search-wrap" style={{ position: 'relative', width: '300px' }}>
                <input 
                    type="text" 
                    placeholder="Search by name, phone, email..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="ultra-login-input"
                    style={{ width: '100%', height: '40px', padding: '0 40px 0 20px', borderRadius: '12px' }}
                />
                <i data-lucide="search" style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, width: '18px' }} />
            </div>
            <button className="btn btn-outline btn-sm">Export CSV</button>
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Contact Info</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Last Seen</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? filteredCustomers.map((c) => (
              <tr key={c.id}>
                <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                            {c.name[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 700 }}>{c.name}</span>
                    </div>
                </td>
                <td>
                    <div style={{ fontSize: '13px' }}>
                        <div style={{ fontWeight: 600 }}>{c.phone}</div>
                        <div style={{ opacity: 0.6 }}>{c.email}</div>
                    </div>
                </td>
                <td style={{ fontWeight: 800 }}>{c.totalOrders || 0}</td>
                <td style={{ fontWeight: 900 }}>{(c.totalSpent || 0).toFixed(2)} ₪</td>
                <td style={{ fontSize: '12px', opacity: 0.6 }}>{c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString('ar-EG') : 'Never'}</td>
                <td>
                    <span style={{ 
                        background: '#11a85f15', 
                        color: '#11a85f', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '11px', 
                        fontWeight: 900,
                        textTransform: 'uppercase'
                    }}>
                        Active
                    </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '60px', opacity: 0.5 }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>No customers found</div>
                    <div>Try adjusting your search filters</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
