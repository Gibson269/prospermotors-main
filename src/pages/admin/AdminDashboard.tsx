import { Car, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/formatters';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [carsResult, ordersResult] = await Promise.all([
        supabase.from('cars').select('id, price, is_sold, is_featured'),
        supabase.from('orders').select('id, total_amount, status'),
      ]);

      const cars = carsResult.data || [];
      const orders = ordersResult.data || [];

      return {
        totalCars: cars.length,
        availableCars: cars.filter(c => !c.is_sold).length,
        featuredCars: cars.filter(c => c.is_featured).length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        totalRevenue: orders.reduce((sum, o) => sum + Number(o.total_amount), 0),
      };
    },
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const statCards = [
    {
      title: 'Total Vehicles',
      value: stats?.totalCars || 0,
      subtitle: `${stats?.availableCars || 0} available`,
      icon: Car,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      subtitle: `${stats?.pendingOrders || 0} pending`,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats?.totalRevenue || 0),
      subtitle: 'All time',
      icon: DollarSign,
      color: 'bg-gold',
    },
    {
      title: 'Featured Cars',
      value: stats?.featuredCars || 0,
      subtitle: 'On homepage',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Prosperous Autos Admin</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-sm border border-border"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.title}</p>
                  <p className="font-serif text-2xl font-semibold mt-1">{stat.value}</p>
                  <p className="text-muted-foreground text-xs mt-1">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-card rounded-sm border border-border">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="font-serif text-xl font-semibold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-gold text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 text-sm font-medium">Customer</th>
                  <th className="text-left p-4 text-sm font-medium">Items</th>
                  <th className="text-left p-4 text-sm font-medium">Total</th>
                  <th className="text-left p-4 text-sm font-medium">Status</th>
                  <th className="text-left p-4 text-sm font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders && recentOrders.length > 0 ? (
                  recentOrders.map((order) => {
                    const items = order.items as any[];
                    return (
                      <tr key={order.id} className="border-t border-border">
                        <td className="p-4">
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-muted-foreground text-sm">{order.customer_email}</p>
                        </td>
                        <td className="p-4 text-sm">
                          {items.length} item{items.length !== 1 ? 's' : ''}
                        </td>
                        <td className="p-4 font-semibold text-gold">
                          {formatPrice(Number(order.total_amount))}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs uppercase ${
                            order.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(order.created_at!).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
