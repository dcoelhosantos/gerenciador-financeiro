"use client";

import { Categoria } from "@/types";
import { useState, useEffect } from "react";

export default function Home() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/categorias");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Categoria[] = await response.json();
        setCategorias(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Categorias</h1>
      <ul>
        {categorias.map((categoria) => (
          <li key={categoria.id}>{categoria.nome}</li>
        ))}
      </ul>
    </div>
  );
}
