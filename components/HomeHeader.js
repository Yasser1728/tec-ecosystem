export default function HomeHeader({ t, dynamicWord, handlePiLogin, handlePayment }) {
  return (
    <header className="text-center px-5 py-[120px]">
      <h1 className="text-8xl font-black text-tec-green mb-4">TEC</h1>
      <h2 className="text-3xl font-bold mb-2">{t.title}</h2>
      <div className="text-[42px] font-black text-tec-blue my-5">
        {dynamicWord}
      </div>
      <p className="text-lg mb-2">{t.description}</p>
      <small className="text-sm text-gray-400">{t.subtitle}</small>

      <div className="mt-10 flex gap-5 justify-center flex-wrap">
        <button
          onClick={handlePiLogin}
          className="bg-tec-green border-none px-10 py-4 font-black text-black rounded-md hover:bg-tec-green/90 transition-colors cursor-pointer"
        >
          {t.loginBtn}
        </button>
        <button
          onClick={handlePayment}
          className="bg-transparent border-2 border-tec-green text-tec-green px-10 py-4 font-bold rounded-md hover:bg-tec-green/10 transition-colors cursor-pointer"
        >
          {t.paymentBtn}
        </button>
      </div>
    </header>
  );
}
