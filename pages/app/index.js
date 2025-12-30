import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Dashboard() {
  const services = [
    { name: "Commerce", url: "/commerce", description: "Marketplace & Stores" },
    {
      name: "Ecommerce",
      url: "/ecommerce",
      description: "Platform for Small Stores",
    },
    { name: "Assets", url: "/assets", description: "Digital Assets & Wallet" },
    { name: "Fundx", url: "/fundx", description: "Investment & Finance" },
    { name: "Estate", url: "/estate", description: "Real Estate Listings" },
    { name: "Insure", url: "/insure", description: "Insurance Services" },
    { name: "Dx", url: "/dx", description: "Developer Tools & API" },
    { name: "Explorer", url: "/explorer", description: "Pi Network Explorer" },
    { name: "NBF", url: "/nbf", description: "Financial & Business Services" },
    { name: "Epic", url: "/epic", description: "Epic Projects & Offerings" },
    {
      name: "Legend",
      url: "/legend",
      description: "Special Programs & Legendary Projects",
    },
    {
      name: "Connection",
      url: "/connection",
      description: "Connect & Collaborate",
    },
    { name: "System", url: "/system", description: "System Settings & Tools" },
    {
      name: "Alerts",
      url: "/alerts",
      description: "Latest Notifications & Alerts",
    },
    { name: "NX", url: "/nx", description: "NX Projects & Tools" },
    {
      name: "Nexus",
      url: "/nexus",
      description: "Hub for Connections & Integrations",
    },
    {
      name: "Brookfield",
      url: "/brookfield",
      description: "Real Estate & Investments",
    },
    { name: "Sab", url: "/sab", description: "SAB Projects & Services" },
    { name: "VIP", url: "/vip", description: "Exclusive VIP Services" },
    {
      name: "Titan",
      url: "/titan",
      description: "Titan Initiatives & Offerings",
    },
    { name: "Zone", url: "/zone", description: "Zones for Collaboration" },
    {
      name: "Elite",
      url: "/elite",
      description: "Premium Services & Exclusive Offerings",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto p-6">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">TEC Ecosystem Dashboard</h1>
          <p className="text-gray-700 text-lg">
            Welcome! Click any service below to visit its dedicated page.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <a
              key={service.name}
              href={service.url}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-semibold mb-2">{service.name}</h2>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </a>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
