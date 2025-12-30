import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - TEC Ecosystem</title>
        <meta
          name="description"
          content="TEC Ecosystem Privacy Policy - How we collect, use, and protect your data"
        />
        <meta
          name="keywords"
          content="privacy policy, data protection, TEC ecosystem, Pi Network"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Privacy Policy / سياسة الخصوصية
          </h1>

          <p className="text-gray-400 mb-8">
            Last Updated: December 27, 2024 / آخر تحديث: ٢٧ ديسمبر ٢٠٢٤
          </p>

          <div className="space-y-8 text-gray-300">
            {/* Introduction */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h2 className="text-3xl font-bold text-[#00ff9d] mb-4">
                1. Introduction / المقدمة
              </h2>
              <p className="mb-3">
                Welcome to TEC Ecosystem. We are committed to protecting your
                privacy and ensuring the security of your personal information.
              </p>
              <p className="text-gray-400">
                مرحباً بك في نظام TEC البيئي. نحن ملتزمون بحماية خصوصيتك وضمان
                أمان معلوماتك الشخصية.
              </p>
            </section>

            {/* Data Collection */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h2 className="text-3xl font-bold text-[#00c6ff] mb-4">
                2. Data Collection / جمع البيانات
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-semibold text-[#00ff9d] mb-2">
                    Information We Collect / المعلومات التي نجمعها
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>
                      Account information (username, email, Pi Network ID)
                    </li>
                    <li>
                      معلومات الحساب (اسم المستخدم، البريد الإلكتروني، معرف Pi
                      Network)
                    </li>
                    <li>Transaction data and payment history</li>
                    <li>بيانات المعاملات وسجل الدفع</li>
                    <li>Usage data and analytics</li>
                    <li>بيانات الاستخدام والتحليلات</li>
                    <li>Device information and IP addresses</li>
                    <li>معلومات الجهاز وعناوين IP</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Data */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h2 className="text-3xl font-bold text-[#00ff9d] mb-4">
                3. How We Use Your Data / كيفية استخدام بياناتك
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>We use your data to:</p>
                <p>نستخدم بياناتك من أجل:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Provide and improve our services / تقديم وتحسين خدماتنا
                  </li>
                  <li>
                    Process transactions and payments / معالجة المعاملات
                    والمدفوعات
                  </li>
                  <li>
                    Communicate with you about services / التواصل معك بشأن
                    الخدمات
                  </li>
                  <li>Ensure platform security / ضمان أمان المنصة</li>
                  <li>
                    Comply with legal obligations / الامتثال للالتزامات
                    القانونية
                  </li>
                  <li>Personalize your experience / تخصيص تجربتك</li>
                </ul>
              </div>
            </section>

            {/* Pi Network Data */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h2 className="text-3xl font-bold text-[#00c6ff] mb-4">
                4. Pi Network Integration / تكامل شبكة Pi
              </h2>
              <div className="space-y-3">
                <p>
                  Our platform integrates with Pi Network for authentication and
                  payments. When you use Pi Network services:
                </p>
                <p className="text-gray-400">
                  منصتنا تتكامل مع شبكة Pi للمصادقة والمدفوعات. عند استخدام
                  خدمات شبكة Pi:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  <li>We receive your Pi Network ID and username</li>
                  <li>نستلم معرف Pi Network الخاص بك واسم المستخدم</li>
                  <li>
                    Payment transactions are processed through Pi Network&apos;s
                    secure infrastructure
                  </li>
                  <li>
                    تتم معالجة معاملات الدفع من خلال البنية التحتية الآمنة لشبكة
                    Pi
                  </li>
                  <li>
                    We do not store your Pi Network password or private keys
                  </li>
                  <li>
                    لا نقوم بتخزين كلمة مرور Pi Network أو المفاتيح الخاصة بك
                  </li>
                </ul>
              </div>
            </section>

            {/* Data Protection */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h2 className="text-3xl font-bold text-[#00ff9d] mb-4">
                5. Data Protection / حماية البيانات
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>We implement industry-standard security measures:</p>
                <p>نطبق تدابير أمنية معتمدة في الصناعة:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Encryption of data in transit and at rest / تشفير البيانات
                    أثناء النقل والتخزين
                  </li>
                  <li>
                    Regular security audits and updates / عمليات تدقيق وتحديثات
                    أمنية منتظمة
                  </li>
                  <li>
                    Access controls and authentication / ضوابط الوصول والمصادقة
                  </li>
                  <li>Secure payment processing / معالجة دفع آمنة</li>
                  <li>
                    Data backup and disaster recovery / النسخ الاحتياطي للبيانات
                    والتعافي من الكوارث
                  </li>
                </ul>
              </div>
            </section>

            {/* User Rights */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h2 className="text-3xl font-bold text-[#00c6ff] mb-4">
                6. Your Rights / حقوقك
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>You have the right to:</p>
                <p>لديك الحق في:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Access your personal data / الوصول إلى بياناتك الشخصية
                  </li>
                  <li>Correct inaccurate data / تصحيح البيانات غير الدقيقة</li>
                  <li>Request data deletion / طلب حذف البيانات</li>
                  <li>Export your data / تصدير بياناتك</li>
                  <li>
                    Opt-out of marketing communications / إلغاء الاشتراك في
                    الاتصالات التسويقية
                  </li>
                  <li>Withdraw consent at any time / سحب الموافقة في أي وقت</li>
                </ul>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h2 className="text-3xl font-bold text-[#00ff9d] mb-4">
                7. Data Sharing / مشاركة البيانات
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>
                  We do not sell your personal data. We may share data with:
                </p>
                <p>نحن لا نبيع بياناتك الشخصية. قد نشارك البيانات مع:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Service providers and partners (with appropriate safeguards)
                  </li>
                  <li>مقدمي الخدمات والشركاء (مع الضمانات المناسبة)</li>
                  <li>Legal authorities when required by law</li>
                  <li>السلطات القانونية عندما يقتضي القانون ذلك</li>
                  <li>Pi Network for authentication and payment processing</li>
                  <li>شبكة Pi للمصادقة ومعالجة الدفع</li>
                </ul>
              </div>
            </section>

            {/* Cookies */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h2 className="text-3xl font-bold text-[#00c6ff] mb-4">
                8. Cookies and Tracking / ملفات تعريف الارتباط والتتبع
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>
                  We use cookies and similar technologies to enhance your
                  experience, analyze usage, and provide personalized content.
                </p>
                <p>
                  نستخدم ملفات تعريف الارتباط والتقنيات المشابهة لتحسين تجربتك
                  وتحليل الاستخدام وتقديم محتوى مخصص.
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h2 className="text-3xl font-bold text-[#00ff9d] mb-4">
                9. Data Retention / الاحتفاظ بالبيانات
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>
                  We retain your data for as long as necessary to provide
                  services and comply with legal obligations.
                </p>
                <p>
                  نحتفظ ببياناتك طالما كان ذلك ضرورياً لتقديم الخدمات والامتثال
                  للالتزامات القانونية.
                </p>
              </div>
            </section>

            {/* International Transfers */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h2 className="text-3xl font-bold text-[#00c6ff] mb-4">
                10. International Data Transfers / النقل الدولي للبيانات
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>
                  Your data may be transferred to and processed in countries
                  outside your residence. We ensure appropriate safeguards are
                  in place.
                </p>
                <p>
                  قد يتم نقل بياناتك ومعالجتها في دول خارج إقامتك. نضمن وجود
                  الضمانات المناسبة.
                </p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h2 className="text-3xl font-bold text-[#00ff9d] mb-4">
                11. Children&apos;s Privacy / خصوصية الأطفال
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>
                  Our services are not intended for children under 18. We do not
                  knowingly collect data from children.
                </p>
                <p>
                  خدماتنا غير مخصصة للأطفال دون سن 18 عاماً. نحن لا نجمع بيانات
                  من الأطفال عن قصد.
                </p>
              </div>
            </section>

            {/* Policy Changes */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h2 className="text-3xl font-bold text-[#00c6ff] mb-4">
                12. Changes to This Policy / التغييرات على هذه السياسة
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>
                  We may update this policy periodically. We will notify you of
                  significant changes via email or platform notification.
                </p>
                <p>
                  قد نقوم بتحديث هذه السياسة بشكل دوري. سنقوم بإخطارك بالتغييرات
                  الهامة عبر البريد الإلكتروني أو إشعار المنصة.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h2 className="text-3xl font-bold text-[#00ff9d] mb-4">
                13. Contact Us / اتصل بنا
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>For privacy-related inquiries:</p>
                <p>للاستفسارات المتعلقة بالخصوصية:</p>
                <ul className="list-none space-y-2">
                  <li>📧 Email: privacy@tec-ecosystem.com</li>
                  <li>🌐 Website: www.tec-ecosystem.com</li>
                  <li>📍 Address: [To be specified]</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
