// src/app/[page]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Header from "@/components/molecules/header";
import PokemonGrid from "@/components/organisms/pokemon-grid";

const ITEMS_PER_PAGE = 20;

async function fetchPokemon(page: number) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`);
  const data = await response.json();
  
  const pokemonDetails = await Promise.all(data.results.map(async (p: any) => {
    const detailResponse = await fetch(p.url);
    const detailData = await detailResponse.json();
    const speciesResponse = await fetch(detailData.species.url);
    const speciesData = await speciesResponse.json();
    return {
      name: p.name,
      number: detailData.id,
      image: detailData.sprites.other.dream_world.front_default || detailData.sprites.front_default,
      types: detailData.types.map((t: any) => t.type.name.toLowerCase()),
      gender_rate: speciesData.gender_rate
    };
  }));

  return {
    pokemon: pokemonDetails,
    totalPages: Math.ceil(data.count / ITEMS_PER_PAGE)
  };
}

export default async function Home({ params, searchParams }: { params: { page: string }, searchParams: { search?: string, types?: string, genders?: string } }) {
  const currentPage = parseInt(params.page) || 1;
  const { pokemon, totalPages } = await fetchPokemon(currentPage);

  if (currentPage < 1 || currentPage > totalPages) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col bg-mainbg">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <PokemonGrid 
          initialPokemon={pokemon}
          currentPage={currentPage}
          totalPages={totalPages}
          initialSearchQuery={searchParams.search || ''}
          initialSelectedTypes={searchParams.types?.split(',') || []}
          initialSelectedGenders={searchParams.genders?.split(',') || []}
        />
      </Suspense>
    </main>
  );
}