import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="min-h-screen bg-black pt-24 pb-12 px-4 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-8 mx-auto">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </div>
      <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Payment Cancelled</h1>
      <p className="text-xl text-gray-400 mb-8">Your order was not completed. You have not been charged.</p>
      <Link href="/cart" className="inline-block px-8 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-gray-200 transition-colors">
        Return to Cart
      </Link>
    </main>
  );
}
