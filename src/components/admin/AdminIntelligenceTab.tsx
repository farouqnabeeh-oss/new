"use client";

import { type Order, type Branch } from "@/lib/types";
import { useState, useMemo } from "react";
import { updateOrderStatus, getOrderSummary } from "@/lib/order-actions";
import { Search, Filter, Calendar, CreditCard, LayoutGrid, RefreshCw, X } from "lucide-react";

type Props = {
  orders: Order[];
  branches: Branch[];
  role?: string;
};

export function AdminIntelligenceTab({ orders, branches, role }: Props) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const isCashier = role?.toLowerCase() === "cashier";

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [periodFilter, setPeriodFilter] = useState("Today");

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // 1. Search Query (ID, Name, Phone, Email)
      const matchesSearch =
        searchQuery === "" ||
        order.id.toString().includes(searchQuery) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Status Filter
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;

      // 3. Branch Filter
      const matchesBranch = branchFilter === "All" || order.branchId.toString() === branchFilter;

      // 4. Payment Method Filter
      const matchesPayment = paymentFilter === "All" ||
        (paymentFilter === "Card" ? (order.paymentMethod === "Card" || order.paymentMethod === "palpay") : order.paymentMethod === "Cash");

      // 5. Period Filter
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      let matchesPeriod = true;
      if (periodFilter === "Today") {
        matchesPeriod = orderDate.toDateString() === now.toDateString();
      } else if (periodFilter === "Yesterday") {
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        matchesPeriod = orderDate.toDateString() === yesterday.toDateString();
      } else if (periodFilter === "This Week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        matchesPeriod = orderDate >= weekAgo;
      }

      return matchesSearch && matchesStatus && matchesBranch && matchesPayment && matchesPeriod;
    });
  }, [orders, searchQuery, statusFilter, branchFilter, paymentFilter, periodFilter]);

  const totalSales = filteredOrders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  const isAr = true; // Defaulting to Arabic for this portal

  return (
    <div className="admin-intelligence-tab">
      <style dangerouslySetInnerHTML={{
        __html: `
        .filter-section {
          background: #fff;
          border-radius: 30px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.03);
          border: 1px solid #ECEAE7;
          margin-bottom: 30px;
        }
        .filter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .filter-label {
          font-size: 13px;
          font-weight: 800;
          color: #666;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .filter-select {
          padding: 14px 20px;
          border-radius: 16px;
          border: 1px solid #ECEAE7;
          background: #FDFCFB;
          font-size: 14px;
          font-weight: 700;
          outline: none;
          cursor: pointer;
          transition: 0.3s;
          color: #1a1a1a;
        }
        .filter-select:focus {
          border-color: #8B0000;
          box-shadow: 0 0 0 4px rgba(139,0,0,0.05);
        }
        .search-container {
          position: relative;
          grid-column: 1 / -1;
        }
        .search-input {
          width: 100%;
          padding: 16px 50px 16px 20px;
          border-radius: 18px;
          border: 1px solid #ECEAE7;
          background: #FDFCFB;
          font-size: 15px;
          font-weight: 600;
          outline: none;
        }
        .search-icon {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #aaa;
        }
        .stats-banner {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
          overflow-x: auto;
          padding-bottom: 15px;
        }
        .mini-stat {
          background: #fff;
          padding: 15px 25px;
          border-radius: 20px;
          border: 1px solid #ECEAE7;
          display: flex;
          flex-direction: column;
          min-width: 160px;
        }
        .mini-stat-label { font-size: 12px; color: #888; font-weight: 800; }
        .mini-stat-value { font-size: 18px; font-weight: 900; color: #1a1a1a; }
      ` }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontWeight: 900, fontSize: '1.8rem', margin: 0 }}>
          {isAr ? "بوابة الكاشير" : "Cashier Portal"}
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline btn-sm" style={{ borderRadius: '15px' }} onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="stats-banner">
        <div className="mini-stat">
          <span className="mini-stat-label">{isAr ? "إجمالي الطلبات" : "Total Orders"}</span>
          <span className="mini-stat-value">{totalOrders}</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat-label">{isAr ? "إجمالي المبيعات" : "Total Sales"}</span>
          <span className="mini-stat-value">{totalSales.toFixed(2)} ₪</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat-label">{isAr ? "متوسط الطلب" : "Avg. Order"}</span>
          <span className="mini-stat-value">{avgOrderValue.toFixed(2)} ₪</span>
        </div>
      </div>

      {/* 🔍 FILTER SECTION */}
      <div className="filter-section">
        <div className="filter-grid">
          <div className="search-container">
            <input
              className="search-input"
              placeholder={isAr ? "رقم الطلب، الاسم، الهاتف، العنوان..." : "Search ID, Name, Phone..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="search-icon" size={20} />
          </div>

          <div className="filter-group">
            <span className="filter-label"><LayoutGrid size={14} /> {isAr ? "الفرع" : "Branch"}</span>
            <select className="filter-select" value={branchFilter} onChange={e => setBranchFilter(e.target.value)}>
              <option value="All">{isAr ? "كل الفروع" : "All Branches"}</option>
              {branches.map(b => (
                <option key={b.id} value={b.id.toString()}>{isAr ? b.nameAr : b.nameEn}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label"><Filter size={14} /> {isAr ? "الحالة" : "Status"}</span>
            <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">{isAr ? "كل الحالات" : "All Statuses"}</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Paid">Paid</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready">Ready</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label"><Calendar size={14} /> {isAr ? "الفترة" : "Period"}</span>
            <select className="filter-select" value={periodFilter} onChange={e => setPeriodFilter(e.target.value)}>
              <option value="Today">{isAr ? "اليوم" : "Today"}</option>
              <option value="Yesterday">{isAr ? "أمس" : "Yesterday"}</option>
              <option value="This Week">{isAr ? "هذا الأسبوع" : "This Week"}</option>
              <option value="All">{isAr ? "الكل" : "All Time"}</option>
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label"><CreditCard size={14} /> {isAr ? "طريقة الدفع" : "Payment"}</span>
            <select className="filter-select" value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
              <option value="All">{isAr ? "كل طرق الدفع" : "All Methods"}</option>
              <option value="Cash">{isAr ? "نقدي (كاش)" : "Cash"}</option>
              <option value="Card">{isAr ? "فیزا / بطاقة" : "Visa / Card"}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 📄 ORDERS TABLE */}
      <div className="admin-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{isAr ? "الطلب" : "Order"}</th>
                <th>{isAr ? "الفرع" : "Branch"}</th>
                <th>{isAr ? "الزبون" : "Customer"}</th>
                <th>{isAr ? "المبلغ" : "Amount"}</th>
                <th>{isAr ? "الدفع" : "Payment"}</th>
                <th>{isAr ? "الحالة" : "Status"}</th>
                <th>{isAr ? "التاريخ" : "Date"}</th>
                <th>{isAr ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 900 }}>#{order.id}</td>
                  <td style={{ fontSize: '12px' }}>{order.branch?.nameAr || "N/A"}</td>
                  <td>
                    <div style={{ fontWeight: 800 }}>{order.customerName}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>{order.customerPhone}</div>
                  </td>
                  <td style={{ fontWeight: 900, color: '#8B0000' }}>{(order.totalAmount ?? 0).toFixed(2)} ₪</td>
                  <td>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: order.paymentMethod === 'Cash' ? '#D97706' : '#2563EB' }}>
                      {order.paymentMethod === 'Cash' ? (isAr ? '💵 كاش' : 'Cash') : (isAr ? '💳 فيزا' : 'Visa')}
                    </span>
                  </td>
                  <td>
                    <span className={`ultra-branch-badge-fire ${order.status.toLowerCase()}`} style={{
                      background: order.status === 'Paid' || order.status === 'Delivered' ? '#11a85f' : order.status === 'Cancelled' ? '#e63946' : '#8B0000',
                      color: '#fff', fontSize: '11px', fontWeight: 900, padding: '4px 10px'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ fontSize: "12px", fontWeight: 700 }}>
                    {new Date(order.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        defaultValue={order.status}
                        className="filter-select"
                        style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '8px' }}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          let estTime = "";
                          if (newStatus === "Confirmed") {
                            estTime = prompt(role === 'Cashier' ? "الوقت المتوقع للتجهيز (مثلاً: 30 دقيقة):" : "Estimated preparation time (e.g. 30 mins):") || "";
                          }
                          const res = await updateOrderStatus(order.id, newStatus, estTime);
                          if (res.success) window.location.reload();
                          else alert('Failed to update status: ' + res.error);
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Paid">Paid</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '11px', padding: '6px 12px', background: '#000', color: '#fff', borderRadius: '8px' }}
                        onClick={async () => {
                          const res = await getOrderSummary(order.id);
                          if (res.success) {
                            setSelectedOrder(res.order);
                          }
                        }}
                      >
                        {isAr ? "تفاصيل" : "Details"}
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '60px', opacity: 0.5 }}>
                    {isAr ? "لا توجد طلبات تطابق الفلترة الحالية" : "No orders matching current filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔍 ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '20px',
          backdropFilter: 'blur(10px)'
        }} onClick={() => setSelectedOrder(null)}>
          <div style={{
            background: '#fff', borderRadius: '40px', width: '100%', maxWidth: '600px',
            maxHeight: '90vh', overflowY: 'auto', padding: '40px', position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', direction: 'rtl'
          }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedOrder(null)}
              style={{ position: 'absolute', top: '25px', left: '25px', border: 'none', background: '#f5f5f5', borderRadius: '50%', width: '45px', height: '45px', cursor: 'pointer', fontSize: '20px' }}
            ><X size={20} /></button>

            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>تفاصيل الطلب #{selectedOrder.id}</h3>
              <p style={{ color: '#888', fontWeight: 700, marginTop: '5px' }}>{new Date(selectedOrder.created_at).toLocaleString('ar-EG')}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px', background: '#f9f9f9', padding: '25px', borderRadius: '30px', border: '1px solid #eee' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#999', fontWeight: 800, display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>العميل</label>
                <div style={{ fontWeight: 900, color: '#1a1a1a' }}>{selectedOrder.customer_name}</div>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#999', fontWeight: 800, display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>رقم الهاتف</label>
                <div style={{ fontWeight: 900, color: '#1a1a1a' }}>{selectedOrder.customer_phone}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '11px', color: '#999', fontWeight: 800, display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>العنوان / مكان الاستلام</label>
                <div style={{ fontWeight: 900, color: '#1a1a1a' }}>{selectedOrder.address || selectedOrder.table_number || 'غير محدد'}</div>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#999', fontWeight: 800, display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>طريقة الدفع</label>
                <div style={{ fontWeight: 900, color: '#8B0000' }}>{selectedOrder.payment_method === 'Cash' ? 'نقدي' : 'فيزا / بطاقة'}</div>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#999', fontWeight: 800, display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>الإجمالي</label>
                <div style={{ fontWeight: 900, color: '#8B0000', fontSize: '1.3rem' }}>{selectedOrder.total_amount} ₪</div>
              </div>
            </div>

            <h4 style={{ fontWeight: 900, marginBottom: '20px', fontSize: '1.1rem' }}>📦 الأصناف المطلوبة</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {selectedOrder.order_items?.map((item: any, idx: number) => (
                <div key={idx} style={{ padding: '20px', borderRadius: '24px', border: '1px solid #eee', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>{item.quantity}x {item.product_name_ar}</span>
                    <span style={{ fontWeight: 900, color: '#8B0000' }}>{item.price * item.quantity} ₪</span>
                  </div>
                  {item.addon_details && (
                    <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', background: '#fcfcfc', padding: '15px', borderRadius: '15px', border: '1px solid #f0f0f0' }}>
                      {item.addon_details.split(' | ').map((part: string, pIdx: number) => {
                        const isWithout = part.includes('بدون') || part.includes('ملاحظات');
                        return (
                          <div key={pIdx} style={{ color: isWithout ? '#e63946' : 'inherit', fontWeight: isWithout ? 800 : 600 }}>
                            {isWithout ? '🚫 ' : '• '}{part}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              style={{ width: '100%', marginTop: '30px', padding: '20px', borderRadius: '20px', border: 'none', background: '#000', color: '#fff', fontWeight: 900, fontSize: '16px', cursor: 'pointer' }}
            >إغلاق النافذة</button>
          </div>
        </div>
      )}
    </div>
  );
}
