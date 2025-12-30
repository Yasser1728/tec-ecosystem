import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - TEC Ecosystem</title>
        <meta
          name="description"
          content="TEC Ecosystem Terms of Service - Terms and conditions for using our platform"
        />
        <meta
          name="keywords"
          content="terms of service, terms and conditions, TEC ecosystem, user agreement"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-6">
            Terms of Service / شروط الخدمة
          </h1>

          <p className="text-gray-400 mb-8">
            Last Updated: December 27, 2024 / آخر تحديث: ٢٧ ديسمبر ٢٠٢٤
          </p>

          <div className="space-y-8 text-gray-300">
            {/* Agreement to Terms */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h2 className="text-3xl font-bold text-[#00ff9d] mb-4">
                1. Agreement to Terms / الموافقة على الشروط
              </h2>
              <div className="space-y-3">
                <p>
                  By accessing and using TEC Ecosystem, you agree to be bound by
                  these Terms of Service and all applicable laws and
                  regulations.
                </p>
                <p className="text-gray-400">
                  من خلال الوصول إلى نظام TEC البيئي واستخدامه، فإنك توافق على
                  الالتزام بشروط الخدمة هذه وجميع القوانين واللوائح المعمول بها.
                </p>
              </div>
            </section>

            {/* Use of Services */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h2 className="text-3xl font-bold text-[#00c6ff] mb-4">
                2. Use of Services / استخدام الخدمات
              </h2>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-[#00ff9d] mb-2">
                  Permitted Use / الاستخدام المسموح به
                </h3>
                <p className="text-gray-400">
                  You may use our services for lawful purposes only. You agree
                  not to:
                </p>
                <p className="text-gray-400">
                  يمكنك استخدام خدماتنا لأغراض قانونية فقط. أنت توافق على عدم:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  <li>
                    Violate any laws or regulations / انتهاك أي قوانين أو لوائح
                  </li>
                  <li>
                    Infringe on intellectual property rights / التعدي على حقوق
                    الملكية الفكرية
                  </li>
                  <li>
                    Transmit malicious code or viruses / نقل الأكواد الضارة أو
                    الفيروسات
                  </li>
                  <li>
                    Attempt unauthorized access / محاولة الوصول غير المصرح به
                  </li>
                  <li>
                    Engage in fraudulent activities / الانخراط في أنشطة احتيالية
                  </li>
                  <li>
                    Harass or harm other users / مضايقة أو إلحاق الضرر
                    بالمستخدمين الآخرين
                  </li>
                </ul>
              </div>
            </section>

            {/* Account Responsibilities */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h2 className="text-3xl font-bold text-[#00ff9d] mb-4">
                3. Account Responsibilities / مسؤوليات الحساب
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>As a user, you are responsible for:</p>
                <p>بصفتك مستخدماً، أنت مسؤول عن:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Maintaining the confidentiality of your account credentials
                    / الحفاظ على سرية بيانات حسابك
                  </li>
                  <li>
                    All activities that occur under your account / جميع الأنشطة
                    التي تحدث تحت حسابك
                  </li>
                  <li>
                    Notifying us immediately of any unauthorized use / إخطارنا
                    فوراً بأي استخدام غير مصرح به
                  </li>
                  <li>
                    Providing accurate and current information / تقديم معلومات
                    دقيقة وحديثة
                  </li>
                  <li>
                    Complying with all applicable laws / الامتثال لجميع القوانين
                    المعمول بها
                  </li>
                </ul>
              </div>
            </section>

            {/* Membership Tiers */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h2 className="text-3xl font-bold text-[#00c6ff] mb-4">
                4. Membership Tiers / مستويات العضوية
              </h2>
              <div className="space-y-3">
                <p>TEC Ecosystem offers different membership levels:</p>
                <p className="text-gray-400">
                  يقدم نظام TEC البيئي مستويات عضوية مختلفة:
                </p>
                <div className="space-y-4 mt-4">
                  <div className="bg-gray-900/50 p-4 rounded border-l-4 border-[#00ff9d]">
                    <h4 className="text-lg font-semibold text-[#00ff9d]">
                      FREE Tier / المستوى المجاني
                    </h4>
                    <p className="text-gray-400">
                      Basic access to platform features
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded border-l-4 border-[#00c6ff]">
                    <h4 className="text-lg font-semibold text-[#00c6ff]">
                      PREMIUM Tier / المستوى المميز
                    </h4>
                    <p className="text-gray-400">
                      Enhanced features and priority support
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded border-l-4 border-[#00ff9d]">
                    <h4 className="text-lg font-semibold text-[#00ff9d]">
                      VIP Tier / مستوى VIP
                    </h4>
                    <p className="text-gray-400">
                      Exclusive access and premium services
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h2 className="text-3xl font-bold text-[#00ff9d] mb-4">
                5. Payment Terms / شروط الدفع
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>Payments are processed through Pi Network:</p>
                <p>تتم معالجة المدفوعات من خلال شبكة Pi:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    All prices are quoted in Pi cryptocurrency / جميع الأسعار
                    مقتبسة بعملة Pi
                  </li>
                  <li>
                    Payments are non-refundable unless required by law /
                    المدفوعات غير قابلة للاسترداد ما لم يقتض القانون ذلك
                  </li>
                  <li>
                    You are responsible for any transaction fees / أنت مسؤول عن
                    أي رسوم معاملات
                  </li>
                  <li>
                    Prices may change with 30 days notice / قد تتغير الأسعار
                    بإشعار مدته 30 يوماً
                  </li>
                  <li>
                    Failed payments may result in service suspension / قد تؤدي
                    المدفوعات الفاشلة إلى تعليق الخدمة
                  </li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h2 className="text-3xl font-bold text-[#00c6ff] mb-4">
                6. Intellectual Property / الملكية الفكرية
              </h2>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-[#00ff9d] mb-2">
                  Our Content / محتوانا
                </h3>
                <p className="text-gray-400">
                  All content, features, and functionality on TEC Ecosystem are
                  owned by us and protected by international copyright,
                  trademark, and other intellectual property laws.
                </p>
                <p className="text-gray-400">
                  جميع المحتويات والميزات والوظائف على نظام TEC البيئي مملوكة
                  لنا ومحمية بموجب حقوق النشر والعلامات التجارية الدولية وقوانين
                  الملكية الفكرية الأخرى.
                </p>
                <h3 className="text-xl font-semibold text-[#00ff9d] mb-2 mt-4">
                  Your Content / محتواك
                </h3>
                <p className="text-gray-400">
                  You retain ownership of content you submit. By submitting
                  content, you grant us a worldwide, non-exclusive license to
                  use, reproduce, and display your content.
                </p>
                <p className="text-gray-400">
                  أنت تحتفظ بملكية المحتوى الذي ترسله. من خلال إرسال المحتوى،
                  فإنك تمنحنا ترخيصاً عالمياً غير حصري لاستخدام المحتوى الخاص بك
                  واستنساخه وعرضه.
                </p>
              </div>
            </section>

            {/* Service Availability */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h2 className="text-3xl font-bold text-[#00ff9d] mb-4">
                7. Service Availability / توفر الخدمة
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>
                  We strive to maintain service availability but do not
                  guarantee uninterrupted access. We may suspend services for
                  maintenance, updates, or unforeseen circumstances.
                </p>
                <p>
                  نسعى للحفاظ على توفر الخدمة ولكننا لا نضمن الوصول دون انقطاع.
                  قد نقوم بتعليق الخدمات للصيانة أو التحديثات أو الظروف غير
                  المتوقعة.
                </p>
              </div>
            </section>

            {/* Disclaimer of Warranties */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h2 className="text-3xl font-bold text-[#00c6ff] mb-4">
                8. Disclaimer of Warranties / إخلاء المسؤولية عن الضمانات
              </h2>
              <div className="space-y-3 text-gray-400">
                <p className="font-semibold uppercase">
                  THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS
                  AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND.
                </p>
                <p className="font-semibold">
                  يتم توفير الخدمات &quot;كما هي&quot; و &quot;كما هي
                  متاحة&quot; دون ضمانات من أي نوع.
                </p>
                <p>
                  We disclaim all warranties, express or implied, including but
                  not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Merchantability / القابلية للتسويق</li>
                  <li>Fitness for a particular purpose / الملاءمة لغرض معين</li>
                  <li>Non-infringement / عدم الانتهاك</li>
                  <li>
                    Accuracy or completeness of content / دقة أو اكتمال المحتوى
                  </li>
                  <li>Security or availability / الأمان أو التوفر</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h2 className="text-3xl font-bold text-[#00ff9d] mb-4">
                9. Limitation of Liability / تحديد المسؤولية
              </h2>
              <div className="space-y-3 text-gray-400">
                <p className="font-semibold uppercase">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE
                  FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                  PUNITIVE DAMAGES.
                </p>
                <p className="font-semibold">
                  إلى أقصى حد يسمح به القانون، لن نكون مسؤولين عن أي أضرار غير
                  مباشرة أو عرضية أو خاصة أو تبعية أو عقابية.
                </p>
                <p>This includes but is not limited to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Loss of profits or revenue / خسارة الأرباح أو الإيرادات
                  </li>
                  <li>Loss of data / فقدان البيانات</li>
                  <li>Business interruption / انقطاع الأعمال</li>
                  <li>Loss of goodwill / فقدان السمعة</li>
                </ul>
              </div>
            </section>

            {/* Indemnification */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h2 className="text-3xl font-bold text-[#00c6ff] mb-4">
                10. Indemnification / التعويض
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>
                  You agree to indemnify and hold harmless TEC Ecosystem from
                  any claims, damages, or expenses arising from:
                </p>
                <p>
                  أنت توافق على تعويض نظام TEC البيئي وإعفائه من أي مطالبات أو
                  أضرار أو نفقات ناشئة عن:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Your use of the services / استخدامك للخدمات</li>
                  <li>Violation of these Terms / انتهاك هذه الشروط</li>
                  <li>
                    Infringement of third-party rights / التعدي على حقوق الطرف
                    الثالث
                  </li>
                  <li>Your content or conduct / محتواك أو سلوكك</li>
                </ul>
              </div>
            </section>

            {/* Termination */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h2 className="text-3xl font-bold text-[#00ff9d] mb-4">
                11. Termination / الإنهاء
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>
                  We may terminate or suspend your account and access
                  immediately, without prior notice, for any breach of these
                  Terms.
                </p>
                <p>
                  يجوز لنا إنهاء أو تعليق حسابك والوصول إليه على الفور، دون
                  إشعار مسبق، لأي انتهاك لهذه الشروط.
                </p>
                <p>
                  You may terminate your account at any time by contacting us.
                  Upon termination, your right to use the services ceases
                  immediately.
                </p>
                <p>
                  يمكنك إنهاء حسابك في أي وقت عن طريق الاتصال بنا. عند الإنهاء،
                  ينتهي حقك في استخدام الخدمات على الفور.
                </p>
              </div>
            </section>

            {/* Dispute Resolution */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h2 className="text-3xl font-bold text-[#00c6ff] mb-4">
                12. Dispute Resolution / حل النزاعات
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>
                  Any disputes arising from these Terms shall be resolved
                  through binding arbitration in accordance with international
                  arbitration rules.
                </p>
                <p>
                  يتم حل أي نزاعات ناشئة عن هذه الشروط من خلال التحكيم الملزم
                  وفقاً لقواعد التحكيم الدولية.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h2 className="text-3xl font-bold text-[#00ff9d] mb-4">
                13. Governing Law / القانون الحاكم
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>
                  These Terms shall be governed by and construed in accordance
                  with applicable international laws, without regard to conflict
                  of law principles.
                </p>
                <p>
                  يتم تحكم هذه الشروط وتفسيرها وفقاً للقوانين الدولية المعمول
                  بها، بغض النظر عن مبادئ تنازع القوانين.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h2 className="text-3xl font-bold text-[#00c6ff] mb-4">
                14. Changes to Terms / التغييرات على الشروط
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>
                  We reserve the right to modify these Terms at any time. We
                  will notify you of material changes via email or platform
                  notification. Continued use after changes constitutes
                  acceptance.
                </p>
                <p>
                  نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بإخطارك
                  بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار المنصة.
                  يشكل الاستخدام المستمر بعد التغييرات قبولاً.
                </p>
              </div>
            </section>

            {/* Severability */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h2 className="text-3xl font-bold text-[#00ff9d] mb-4">
                15. Severability / قابلية الفصل
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>
                  If any provision of these Terms is found to be invalid or
                  unenforceable, the remaining provisions shall continue in full
                  force and effect.
                </p>
                <p>
                  إذا تبين أن أي حكم من هذه الشروط غير صالح أو غير قابل للتنفيذ،
                  فإن الأحكام المتبقية تستمر سارية المفعول بالكامل.
                </p>
              </div>
            </section>

            {/* Entire Agreement */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h2 className="text-3xl font-bold text-[#00c6ff] mb-4">
                16. Entire Agreement / الاتفاق الكامل
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>
                  These Terms constitute the entire agreement between you and
                  TEC Ecosystem regarding the use of our services.
                </p>
                <p>
                  تشكل هذه الشروط الاتفاق الكامل بينك وبين نظام TEC البيئي بشأن
                  استخدام خدماتنا.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20">
              <h2 className="text-3xl font-bold text-[#00ff9d] mb-4">
                17. Contact Information / معلومات الاتصال
              </h2>
              <div className="space-y-3 text-gray-400">
                <p>For questions about these Terms:</p>
                <p>للأسئلة حول هذه الشروط:</p>
                <ul className="list-none space-y-2">
                  <li>📧 Email: legal@tec-ecosystem.com</li>
                  <li>📞 Support: support@tec-ecosystem.com</li>
                  <li>🌐 Website: www.tec-ecosystem.com</li>
                  <li>📍 Address: [To be specified]</li>
                </ul>
              </div>
            </section>

            {/* Acceptance */}
            <section className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20">
              <h2 className="text-3xl font-bold text-[#00c6ff] mb-4">
                18. Acknowledgment / الإقرار
              </h2>
              <div className="space-y-3 text-gray-400">
                <p className="font-semibold uppercase">
                  BY USING TEC ECOSYSTEM, YOU ACKNOWLEDGE THAT YOU HAVE READ,
                  UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE.
                </p>
                <p className="font-semibold">
                  باستخدام نظام TEC البيئي، فإنك تقر بأنك قد قرأت هذه الشروط
                  وفهمتها وتوافق على الالتزام بها.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
