export default function ResourceHubCard({ title, description, image, imageAlt, buttons, activeKey, onSelect }) {
  return (
    <article className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-4 ring-white transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-52">
        <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-sky-900/70 to-transparent" />
        <h2 className="absolute bottom-4 left-5 font-display text-3xl text-white">{title}</h2>
      </div>
      <div className="p-6">
        <p className="text-slate-600">{description}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {buttons.map((button) => {
            const selected = activeKey === button.key;
            return (
              <button
                key={button.key}
                type="button"
                onClick={() => onSelect(button)}
                className={`rounded-full px-5 py-3 text-base font-extrabold shadow-md transition duration-200 hover:-translate-y-0.5 ${
                  selected ? `${button.activeClass} text-white` : `${button.idleClass} text-sky-950`
                }`}
              >
                {button.label}
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}
