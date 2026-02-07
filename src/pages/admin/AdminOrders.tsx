import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Mail, Phone } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice, formatDate } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface OrderItem {
  car_id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string | null;
  items: OrderItem[];
  total_amount: number;
  status: string;
  notes: string | null;
  created_at: string;
}

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(order => ({
        ...order,
        items: order.items as unknown as OrderItem[],
      })) as Order[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const statusOptions = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold">Orders</h1>
            <p className="text-muted-foreground">Manage customer orders</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filter:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status} className="capitalize">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-card rounded-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 text-sm font-medium">Order ID</th>
                  <th className="text-left p-4 text-sm font-medium">Customer</th>
                  <th className="text-left p-4 text-sm font-medium">Items</th>
                  <th className="text-left p-4 text-sm font-medium">Total</th>
                  <th className="text-left p-4 text-sm font-medium">Status</th>
                  <th className="text-left p-4 text-sm font-medium">Date</th>
                  <th className="text-right p-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <div className="animate-pulse">Loading...</div>
                    </td>
                  </tr>
                ) : orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="border-t border-border">
                      <td className="p-4">
                        <span className="font-mono text-sm">
                          {order.id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-muted-foreground text-sm">{order.customer_email}</p>
                      </td>
                      <td className="p-4 text-sm">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="p-4 font-semibold text-gold">
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className="p-4">
                        <Select
                          value={order.status}
                          onValueChange={(status) => updateStatusMutation.mutate({ id: order.id, status })}
                        >
                          <SelectTrigger className={`w-32 ${getStatusColor(order.status)} border-0`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(status => (
                              <SelectItem key={status} value={status} className="capitalize">
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6 mt-4">
                {/* Order Info */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono">{selectedOrder.id}</p>
                  </div>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>

                <Separator />

                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedOrder.customer_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${selectedOrder.customer_email}`} className="hover:text-gold">
                        {selectedOrder.customer_email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${selectedOrder.customer_phone}`} className="hover:text-gold">
                        {selectedOrder.customer_phone}
                      </a>
                    </div>
                    {selectedOrder.customer_address && (
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p>{selectedOrder.customer_address}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-sm">
                        <div>
                          <p className="font-medium">{item.brand} {item.model}</p>
                          <p className="text-sm text-muted-foreground">{item.year}</p>
                        </div>
                        <p className="font-semibold text-gold">{formatPrice(item.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount</span>
                  <span className="price-tag">{formatPrice(selectedOrder.total_amount)}</span>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Customer Notes</h3>
                      <p className="text-muted-foreground">{selectedOrder.notes}</p>
                    </div>
                  </>
                )}

                {/* Date */}
                <div className="text-sm text-muted-foreground">
                  Order placed on {formatDate(selectedOrder.created_at)}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
