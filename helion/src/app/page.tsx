import SimulationForm from "@/components/SimulationForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white text-lg font-bold">
            Y
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-none">
              YEYS
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Yenilenebilir Enerji Yönetim Sistemi — Mayıs Simülasyonu
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <SimulationForm />
      </main>
    </div>
  );
}
