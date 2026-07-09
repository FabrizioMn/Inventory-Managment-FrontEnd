import { useState } from "react";

function Ventas() {


  const [listaProductos,setListaProductos]=useState([])
  

  return (
    <section className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-white min-h-24 flex items-center px-8 shadow-md">
        <h1 className="text-3xl text-[#3d4946] font-medium tracking-tight">
          Gestion de Ventas
        </h1>
      </header>
      <main className="flex-1">
        <p>Hola aqui ira el contenido</p>
      </main>
    </section>
  );
}

export default Ventas;
