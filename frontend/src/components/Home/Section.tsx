interface SectionProps {
  title: string;
  text: JSX.Element;
  image: string;
  reversed?: boolean; // Hvis true, så vil layout være speilvendt
}

export default function Section({ title, text, image, reversed = false }: SectionProps) {
  return (
    <section className=" flex flex-col w-3/4">
      <div
        className={`flex gap-10 ${reversed ? 'flex-row-reverse' : 'flex-row'} items-center`}>
        <div className="w-3/5">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl leading-10">{text}</p>
        </div>
        <div className="w-2/5">
          <img src={image} alt={title} className="shadow-none w-auto" />
        </div>
      </div>
    </section>
  );
}
