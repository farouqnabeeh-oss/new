"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveCustomerAction, deleteCustomerAction, type ActionResult } from "@/lib/actions";
import { AdminSubmitButton, AdminDeleteButton } from "@/components/admin/AdminSubmitButton";
import { useToast } from "@/components/admin/AdminToast";
import type { Customer } from "@/lib/types";

type Props = {
  customers: Customer[];
};

export function AdminCustomersTab({ customers }: Props) {
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(0);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const handleEdit = (c: Customer) => {
    setEditId(c.id);
    if (formRef.current) {
        (formRef.current.elements.namedItem("Name") as HTMLInputElement).value = c.name;
        (formRef.current.elements.namedItem("Email") as HTMLInputElement).value = c.email || "";
        (formRef.current.elements.namedItem("Phone") as HTMLInputElement).value = c.phone || "";
    }
  };

  const handleSave = async (formData: FormData) => {
    const res = await saveCustomerAction(formData);
    if (res.success) {
        showToast(editId === 0 ? "Customer created!" : "Customer updated!");
        setEditId(0);
        formRef.current?.reset();
        router.refresh();
    } else {
        showToast(res.error || "Error", "error");
    }
  };

  const handleDelete = async (formData: FormData) => {
    const res = await deleteCustomerAction(formData);
    if (res.success) {
        showToast("Customer deleted!");
        router.refresh();
    } else {
        showToast(res.error || "Error", "error");
    }
  };


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
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => { setEditId(0); formRef.current?.reset(); }}>+ Add New Customer</button>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '20px', padding: '20px' }}>
         <form ref={formRef} action={handleSave} className="admin-form-row" style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
             <input type="hidden" name="Id" value={editId} />
             <div className="premium-input-group" style={{ flex: 1 }}>
                <label>Customer Name</label>
                <input name="Name" placeholder="Full Name" required className="premium-input" />
             </div>
             <div className="premium-input-group" style={{ flex: 1 }}>
                <label>Phone Number</label>
                <input name="Phone" placeholder="05x..." required className="premium-input" />
             </div>
             <div className="premium-input-group" style={{ flex: 1 }}>
                <label>Email (Optional)</label>
                <input name="Email" type="email" placeholder="example@mail.com" className="premium-input" />
             </div>
             <div style={{ paddingBottom: '5px' }}>
                <AdminSubmitButton label={editId === 0 ? "Add Customer" : "Update Customer"} />
                {editId !== 0 && <button type="button" className="btn btn-outline btn-sm" onClick={() => { setEditId(0); formRef.current?.reset(); }} style={{ marginLeft: '10px' }}>Cancel</button>}
             </div>
         </form>
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
              <th>Actions</th>
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
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => handleEdit(c)}>Edit</button>
                        <form action={handleDelete}>
                            <input type="hidden" name="id" value={c.id} />
                            <AdminDeleteButton confirmMessage="Are you sure you want to delete this customer?" />
                        </form>
                    </div>
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
