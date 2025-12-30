import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AssetsPortfolio() {
  return (
    <>
      <Head>
        <title>Portfolio Overview - Assets | TEC</title>
        <meta
          name="description"
          content="Comprehensive portfolio management dashboard"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Portfolio Overview / نظرة عامة على المحفظة
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Elite Asset Management Dashboard / لوحة إدارة الأصول النخبوية
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-lg text-gray-400 mb-2">
                Total Value / القيمة الإجمالية
              </h3>
              <p className="text-3xl font-bold text-[#00ff9d]">2.5M Pi</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-lg text-gray-400 mb-2">
                YTD Return / العائد السنوي
              </h3>
              <p className="text-3xl font-bold text-[#00c6ff]">+24.3%</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-lg text-gray-400 mb-2">
                Assets Count / عدد الأصول
              </h3>
              <p className="text-3xl font-bold text-[#00ff9d]">18</p>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
            <h3 className="text-2xl font-bold text-[#00c6ff] mb-4">
              Asset Allocation / توزيع الأصول
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Real Estate</span>
                  <span className="text-[#00ff9d]">40%</span>
                </div>
                <div className="w-full bg-gray-900 rounded h-2">
                  <div
                    className="bg-[#00ff9d] h-2 rounded"
                    style={{ width: "40%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Technology</span>
                  <span className="text-[#00c6ff]">30%</span>
                </div>
                <div className="w-full bg-gray-900 rounded h-2">
                  <div
                    className="bg-[#00c6ff] h-2 rounded"
                    style={{ width: "30%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Luxury Goods</span>
                  <span className="text-[#00ff9d]">20%</span>
                </div>
                <div className="w-full bg-gray-900 rounded h-2">
                  <div
                    className="bg-[#00ff9d] h-2 rounded"
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Other</span>
                  <span className="text-[#00c6ff]">10%</span>
                </div>
                <div className="w-full bg-gray-900 rounded h-2">
                  <div
                    className="bg-[#00c6ff] h-2 rounded"
                    style={{ width: "10%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
