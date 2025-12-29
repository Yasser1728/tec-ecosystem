import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function EstateMarketplace() {
  const [filters, setFilters] = useState({
    propertyType: 'all',
    priceRange: 'all',
    location: 'all',
    bedrooms: 'all'
  });

  // Sample products - في الإنتاج هتيجي من Database
  const properties = [
    {
      id: '1',
      title: 'Luxury Villa in Dubai Marina',
      description: 'Stunning 5-bedroom villa with private pool and sea view',
      price: 5000,
      currency: 'PI',
      images: ['/images/villa1.jpg'],
      category: 'residential',
      specifications: {
        bedrooms: 5,
        bathrooms: 6,
        sqm: 450,
        parking: 3,
        furnished: true
      },
      location: {
        city: 'Dubai',
        area: 'Dubai Marina',
        country: 'UAE'
      },
      status: 'ACTIVE'
    },
    {
      id: '2',
      title: 'Modern Apartment in Downtown',
      description: '2-bedroom apartment with city view',
      price: 1500,
      currency: 'PI',
      images: ['/images/apt1.jpg'],
      category: 'residential',
      specifications: {
        bedrooms: 2,
        bathrooms: 2,
        sqm: 120,
        parking: 1,
        furnished: false
      },
      location: {
        city: 'Dubai',
        area: 'Downtown',
        country: 'UAE'
      },
      status: 'ACTIVE'
    },
    {
      id: '3',
      title: 'Commercial Office Space',
      description: 'Prime office location in Business Bay',
      price: 3000,
      currency: 'PI',
      images: ['/images/office1.jpg'],
      category: 'commercial',
      specifications: {
        sqm: 200,
        parking: 5,
        furnished: true,
        floor: 15
      },
      location: {
        city: 'Dubai',
        area: 'Business Bay',
        country: 'UAE'
      },
      status: 'ACTIVE'
    }
  ];

  const filteredProperties = properties.filter(property => {
    if (filters.propertyType !== 'all' && property.category !== filters.propertyType) return false;
    if (filters.bedrooms !== 'all' && property.specifications.bedrooms !== parseInt(filters.bedrooms)) return false;
    return true;
  });

  const addToCart = (productId) => {
    console.log('Adding to cart:', productId);
    // TODO: Implement cart functionality
    alert('Added to cart! (Cart functionality coming soon)');
  };

  return (
    <>
      <Head>
        <title>Estate Marketplace - TEC Ecosystem</title>
        <meta name="description" content="Buy and sell luxury real estate with Pi Network" />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
              🏠 Estate Marketplace
            </h1>
            <p className="text-gray-400">
              Luxury real estate powered by Pi Network
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4 text-[#00ff9d]">Filters</h2>

                {/* Property Type */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Property Type</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="all">All Types</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Bedrooms</label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="all">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Price Range (Pi)</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="all">All Prices</option>
                    <option value="0-1000">0 - 1,000 Pi</option>
                    <option value="1000-3000">1,000 - 3,000 Pi</option>
                    <option value="3000-5000">3,000 - 5,000 Pi</option>
                    <option value="5000+">5,000+ Pi</option>
                  </select>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="all">All Locations</option>
                    <option value="dubai-marina">Dubai Marina</option>
                    <option value="downtown">Downtown</option>
                    <option value="business-bay">Business Bay</option>
                  </select>
                </div>

                <button
                  onClick={() => setFilters({propertyType: 'all', priceRange: 'all', location: 'all', bedrooms: 'all'})}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-4 text-gray-400">
                {filteredProperties.length} properties found
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-gray-800 border border-[#00ff9d]/20 rounded-lg overflow-hidden hover:border-[#00ff9d] transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <span className="text-6xl">🏠</span>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-[#00ff9d]">
                        {property.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {property.description}
                      </p>

                      {/* Specifications */}
                      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                        {property.specifications.bedrooms && (
                          <div className="flex items-center gap-2">
                            <span>🛏️</span>
                            <span>{property.specifications.bedrooms} Beds</span>
                          </div>
                        )}
                        {property.specifications.bathrooms && (
                          <div className="flex items-center gap-2">
                            <span>🚿</span>
                            <span>{property.specifications.bathrooms} Baths</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span>📐</span>
                          <span>{property.specifications.sqm} sqm</span>
                        </div>
                        {property.specifications.parking && (
                          <div className="flex items-center gap-2">
                            <span>🚗</span>
                            <span>{property.specifications.parking} Parking</span>
                          </div>
                        )}
                      </div>

                      {/* Location */}
                      <div className="text-sm text-gray-400 mb-4">
                        📍 {property.location.area}, {property.location.city}
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-[#00ff9d]">
                            {property.price} Pi
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(property.id)}
                          className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProperties.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No properties match your filters</p>
                  <button
                    onClick={() => setFilters({propertyType: 'all', priceRange: 'all', location: 'all', bedrooms: 'all'})}
                    className="mt-4 text-[#00ff9d] hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-12 text-center">
            <Link href="/estate" className="text-[#00ff9d] hover:underline">
              ← Back to Estate Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
