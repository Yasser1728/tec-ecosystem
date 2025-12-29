import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function LifeResources() {
  return (
    <>
      <Head>
        <title>Elite Resources - Life | TEC</title>
        <meta name="description" content="Educational resources for wealth building" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Elite Resources / الموارد النخبوية
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Educational Resources for Legacy Building / موارد تعليمية لبناء الإرث
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Video Courses / دورات فيديو</h3>
              <p className="text-gray-400">Expert-led wealth management courses</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">eBooks & Guides / كتب إلكترونية وأدلة</h3>
              <p className="text-gray-400">Comprehensive financial planning guides</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">Webinars / ندوات عبر الإنترنت</h3>
              <p className="text-gray-400">Live sessions with wealth experts</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">Community Forums / منتديات المجتمع</h3>
              <p className="text-gray-400">Connect with like-minded investors</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
