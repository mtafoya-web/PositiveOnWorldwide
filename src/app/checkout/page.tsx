import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-8">Checkout</h1>
        <div className="p-12 border border-gray-800 rounded-2xl mb-8">
          <p className="text-gray-400 font-medium uppercase tracking-widest">Checkout form goes here.</p>
        </div>
      </div>
    </main>
  );
}
