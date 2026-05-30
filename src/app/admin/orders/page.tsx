import { formatCurrency } from "@/lib/utils";
import { getOrders } from "@/lib/storefront-data";
import { Package, CheckCircle2, Clock } from "lucide-react";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-5xl font-black uppercase tracking-tighter italic mb-2">Orders</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Track and fulfill customer energy</p>
      </header>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-neutral-900/50 border border-gray-800 rounded-3xl overflow-hidden group hover:border-white transition-colors duration-500">
            <div className="p-8 flex flex-col md:flex-row justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-white">#{order.orderNumber}</span>
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2
                    ${order.status === 'paid' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}
                  `}>
                    {order.status === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {order.status}
                  </div>
                  <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Customer</h4>
                    <p className="font-bold text-sm text-white">{order.customerEmail}</p>
                    {order.user && <p className="text-[10px] text-gray-600 font-bold uppercase mt-1">POW Member: {order.user.name}</p>}
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Total Amount</h4>
                    <p className="text-xl font-black italic text-white">{formatCurrency(order.totalCents, order.currency)}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-800 pt-8 md:pt-0 md:pl-8">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-4 italic">Items ({order.orderItems.length})</h4>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-black rounded-lg border border-gray-800 overflow-hidden flex-shrink-0">
                        <img src={item.product.image} alt="" className="w-full h-full object-cover opacity-80" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-tight text-white">{item.product.name}</p>
                        <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{item.size} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="py-32 text-center border border-dashed border-gray-800 rounded-[3rem]">
            <Package className="w-12 h-12 text-gray-800 mx-auto mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No orders processed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
