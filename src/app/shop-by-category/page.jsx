import Link from "next/link";

export default async function ShopByCategoryPage() {
  let categories = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/category?limit=100`, { cache: 'no-store' });
    const json = await res.json();
    categories = json?.body?.data?.result || json?.body?.data || [];
  } catch (e) {
    console.error('Error fetching categories server-side', e.message || e);
    categories = [];
  }

  if (!categories || categories.length === 0) {
    return <div className="py-12 text-center">No categories available.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-light text-center mb-6">Shop By Category</h1>
      <p className="text-center text-gray-600 mb-10">Explore our product categories.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link key={cat._id} href={`/${cat.slug}`} className="group block">
            <div className="w-full h-40 bg-gray-100 overflow-hidden rounded-md mb-3">
              <img
                src={cat.image || '/api/placeholder/400/300'}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
