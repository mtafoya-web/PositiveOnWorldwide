export default function AdminProductEditPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Edit Product: {params.id}</h1>
      <div className="border border-gray-800 rounded-2xl p-8 text-center text-gray-500">
        Product edit form coming soon.
      </div>
    </div>
  );
}
