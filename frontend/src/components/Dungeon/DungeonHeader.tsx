import { useEffect, useState } from "react";

const DungeonHeader = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <>
      <header className={`text-center mb-18 bg-customGray bg-opacity-80 rounded-lg p-8 w-3/4 tablet:w-1/2 laptop:w-8/12 desktop:w-10/12 transition-all duration-500 ease-out ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"}`} >
        <h1 className="laptop:text-6xl text-4xl text-white font-bold ">Dungeon creator</h1>
        <p className="text-white text-xl">Discover more monsters to add to the dungeon in the 'Monster Discover'!</p>
      </header>
    </>
  );
};


export default DungeonHeader;
