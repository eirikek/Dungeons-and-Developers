interface SectionProps {
  title: string;
  text: JSX.Element;
  image: string;
  reversed?: boolean; // Hvis true, så vil layout være speilvendt
}

export default function Section({ title, text, image, reversed = false }: SectionProps) {
  return (
    <section className="flex flex-col 3xl:w-3/4 w-5/6">
      <div
        className={`flex gap-10 ${reversed ? '2xl:flex-row-reverse flex-col' : '2xl:flex-row flex-col'} laptop:flex-col items-center`}>
        <div className="w-full 2xl:w-3/5">
          <h2 className="sm:text-4xl text-3xl font-bold mb-4">{title}</h2>
          <p className="text-md lg:leading-10 sm:text-xl leading-8">{text}</p>
        </div>
        <div className="w-2/5">
          <img src={image} alt={title} className="shadow-none w-auto hidden 2xl:block" />
        </div>
      </div>
    </section>
  );
}
