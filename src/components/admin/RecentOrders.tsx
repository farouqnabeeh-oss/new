import { Order } from '@/lib/types';

type Props = {
  orders: Order[];
};

export function RecentOrders({ orders }: Props) {
  return (
    <div className="recent-orders-card">
      <div className="card-header">
        <h3 className="card-title">Recent Orders</h3>
        <button className="btn btn-link">View All</button>
      </div>
      <div className="table-responsive">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <div className="customer-info">
                      <span className="customer-name">{order.customerName}</span>
                      <span className="customer-phone">{order.customerPhone}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-type badge-${order.orderType.toLowerCase()}`}>
                      {order.orderType}
                    </span>
                  </td>
                  <td className="amount">₪{order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`badge badge-status status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="date">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                  No recent orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
