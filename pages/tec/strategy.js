import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function TecStrategy() {
  return (
    <>
      <Head>
        <title>Strategic Guidance - TEC | Titan Elite Commerce</title>
        <meta
          name="description"
          content="Strategic guidance for navigating the TEC ecosystem"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Strategic Guidance / التوجيه الاستراتيجي
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Navigate the TEC Ecosystem with Expert Guidance / تنقل في نظام TEC
            بتوجيه خبير
          </p>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Step 1: Choose Your Path / اختر مسارك
              </h3>
              <p className="text-gray-400">
                Start by identifying which business tiers align with your
                investment goals. Finance & Investment for wealth building,
                Technology for innovation, or Authority & Legacy for market
                leadership.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Step 2: Build Your Portfolio / ابن محفظتك
              </h3>
              <p className="text-gray-400">
                Diversify across multiple domains to maximize returns and
                minimize risk. Our AI-powered recommendation engine suggests
                optimal domain combinations based on your profile.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Step 3: Leverage Synergies / استفد من التآزر
              </h3>
              <p className="text-gray-400">
                Use Nexus to coordinate across domains and create powerful
                synergies. Connect investments in Real Estate with financing
                from NBF and protection from Insure.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                Step 4: Scale with Authority / توسع بسلطة
              </h3>
              <p className="text-gray-400">
                As you grow, leverage Titan and Epic to establish market
                authority and create lasting legacy projects. Access Legend
                membership for the ultimate elite experience.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-[#00ff9d]/10 to-[#00c6ff]/10 p-8 rounded-lg border border-[#00ff9d]/20">
            <h3 className="text-2xl font-bold text-[#00c6ff] mb-4">
              Need Personalized Guidance?
            </h3>
            <p className="text-gray-300 mb-6">
              Book a consultation with our strategic advisors to create a
              customized roadmap for your TEC ecosystem journey.
            </p>
            <button className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-black font-bold py-3 px-8 rounded-lg hover:opacity-90 transition">
              Book Consultation / احجز استشارة
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
