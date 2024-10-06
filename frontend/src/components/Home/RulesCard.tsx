import useRules from '../../hooks/useRules.ts';

export default function RulesCard() {
  const rules = useRules();

  return (
    <section className="py-12 px-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8">How to Play</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rules.length > 0 ? (
          rules.map((rule) => (
            <div key={rule.index} className="bg-white p-6 shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{rule.name}</h3>
              {rule.desc && rule.desc.map((desc, i) => <p key={i} className="text-gray-700 mb-2">{desc}</p>)}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Loading rules...</p>
        )}
      </div>
    </section>
  );
}