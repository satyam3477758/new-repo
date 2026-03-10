import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, Calendar, MapPin, Phone, Mail, Package } from 'lucide-react';
const OrderHistory = () => {
  const { getUserOrders, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deliveryDetails, setDeliveryDetails] = useState<any>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await getUserOrders();
        
        // We don't have Supabase anymore, so we just use the data natively 
        // or provide fallbacks if some fields are missing.
        const ordersWithProducts = userOrders.map((order: any) => {
          if (order.order_items && order.order_items.length > 0) {
            const itemsWithProducts = order.order_items.map((item: any) => {
              return {
                ...item,
                product_name: item.product_name || `Product #${item.product_id}`,
                product_image: item.product_image || '/placeholder.svg'
              };
            });
            return { ...order, order_items: itemsWithProducts };
          }
          return order;
        });
        
        setOrders(ordersWithProducts);
        
        // Load delivery details from localStorage
        const savedDetails = localStorage.getItem('lastDeliveryDetails');
        if (savedDetails) {
          setDeliveryDetails(JSON.parse(savedDetails));
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getUserOrders]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-muted-foreground text-center">
            When you place your first order, it will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'processing':
        return 'bg-blue-500 text-white';
      case 'shipped':
        return 'bg-purple-500 text-white';
      case 'delivered':
      case 'completed':
        return 'bg-green-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-lg">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(order.status)}>
                  {order.status?.toUpperCase() || 'PENDING'}
                </Badge>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold text-primary">
                    ₹{order.total_amount?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Order Items */}
              {order.order_items && order.order_items.length > 0 ? (
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Order Items
                  </h4>
                  <div className="space-y-3">
                    {order.order_items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                        <img
                          src={item.product_image || '/placeholder.svg'}
                          alt={item.product_name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × ₹{item.price_at_purchase?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ₹{((item.quantity || 0) * (item.price_at_purchase || 0)).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No items found</p>
              )}

              {/* Delivery Details */}
              {deliveryDetails && (
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Delivery Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{deliveryDetails.fullName}</p>
                        <p className="text-muted-foreground">{deliveryDetails.address}</p>
                        <p className="text-muted-foreground">
                          {deliveryDetails.city}, {deliveryDetails.state} - {deliveryDetails.pincode}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="text-muted-foreground">{deliveryDetails.phone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p className="text-muted-foreground">{deliveryDetails.email}</p>
                      </div>
                    </div>
                  </div>
                  {deliveryDetails.notes && (
                    <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium mb-1">Additional Notes:</p>
                      <p className="text-sm text-muted-foreground">{deliveryDetails.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderHistory;