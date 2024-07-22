// src\components\molecules\header\index.tsx
import React from 'react';

const Header = () => {
    return(
        <div className='flex flex-col gap-2 m-10 ml-15 md:flex-row md:gap-5 md:items-center'>
            <h1 className='text-maintext text-2xl font-bold'> Pokédex </h1>
            <span className='text-maintext text-3xl font-light hidden md:flex'> | </span>
            <span className='text-maintext text-3xl mt-[-25px] font-light flex md:hidden'>_________________________ </span>
            <h2 className='text-maintext text-md font-semibold pt-1'> Search for any Pokémon that 
            exists on the planet </h2>
        </div>
        
    )
}

export default Header;

//media queires, mobile first design
// Next.js -> 17th June
// Accessibilty, AA, fix the accesibilty issues -> 19th June
// Lighthouse(Perfromance) -> 20-21st June
// Implement SEO using NextJS metatags specifically -> 22nd-23rd June || OG tags
