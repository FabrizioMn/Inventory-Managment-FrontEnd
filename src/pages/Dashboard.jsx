function Dashboard() {
  return (
    <section className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-white min-h-24 flex items-center px-8 shadow-md">
        <h1 className="text-3xl text-[#3d4946] font-medium tracking-tight">
          Bienvenido al Sistema
        </h1>
      </header>

      <main className="flex-1">
        <div className="w-full mx-auto max-w-7xl mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="flex flex-col gap-3 justify-center items-center bg-white p-6 rounded-xl border border-slate-200 shadow-md">
            <h2 className="text-6xl">0</h2>
            <span className="text-base font-medium text-slate-500 uppercase tracking-wider text-center">
              Total Productos
            </span>{" "}
          </div>
          <div className="flex flex-col gap-3 justify-center items-center bg-white p-6 rounded-xl border border-slate-200 shadow-md">
            <h2 className="text-6xl">0</h2>
            <span className="text-base font-medium text-slate-500 uppercase tracking-wider text-center">
              Total Movimientos
            </span>{" "}
          </div>
          <div className="flex flex-col gap-3 justify-center items-center bg-white p-6 rounded-xl border border-slate-200 shadow-md">
            <h2 className="text-6xl">0</h2>
            <span className="text-base font-medium text-slate-500 uppercase tracking-wider text-center">
              Sin Stock
            </span>{" "}
          </div>
          <div className="flex flex-col gap-3 justify-center items-center bg-white p-6 rounded-xl border border-slate-200 shadow-md">
            <h2 className="text-6xl">0</h2>
            <span className="text-base font-medium text-slate-500 uppercase tracking-wider text-center">
              Stock Bajo
            </span>{" "}
          </div>
  
        </div>

        <div className="bg-white mx-auto max-w-7xl p-6 rounded-xl border border-slate-200 shadow-md mt-6">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-medium text-[#3d4946]">
              Listado de Emergencia
            </h2>
          </div>
        </div>
      </main>
    </section>
  );
}

export default Dashboard;
