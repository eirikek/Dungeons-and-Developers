import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';

export default function DungeonPage() {
  const name: string = 'The sunken citadel';
  return (
    <>
      <main className="flex flex-col text-center">
        <header className="mt-8 flex flex-col gap-6 items-center">
          <h1 className="text-6xl">Dungeon creator</h1>
          <span className="flex flex-row gap-4">
            <h4 className="text-4xl">{name}</h4>
            <button className="btn btn-reset hover:cursor-pointer ">
              <ModeEditOutlineIcon fontSize="large" />
            </button>
          </span>
        </header>
        <section className="flex flex-col"></section>
      </main>
    </>
  );
}
