// src\app\pokemon\[slug]\page.tsx
import { notFound } from 'next/navigation';
import PokemonPageClient from '@/components/organisms/pokemon-details';

async function fetchPokemonData(id: string) {
  try {
    const [pokemonRes, speciesRes] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    ]);

    const pokemonData = await pokemonRes.json();
    const speciesData = await speciesRes.json();

    return {
      structuredData: pokemonData,
      dataSpecies: speciesData,
      pokemonData: {
        image: pokemonData.sprites.other.dream_world.front_default || pokemonData.sprites.front_default,
        types: pokemonData.types,
        id: pokemonData.id,
        name: pokemonData.name
      }
    };
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    return null;
  }
}

export default async function PokemonPage({ params }: { params: { slug: string } }) {
  const [id, name] = params.slug.split('-');
  
  if (isNaN(Number(id)) || !name) {
    notFound();
  }

  const pokemonData = await fetchPokemonData(id);

  if (!pokemonData) {
    notFound();
  }

  return <PokemonPageClient 
    initialStructuredData={pokemonData.structuredData}
    initialDataSpecies={pokemonData.dataSpecies}
    initialPokemonData={pokemonData.pokemonData}
  />;
}