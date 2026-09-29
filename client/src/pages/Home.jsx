import { Link } from 'react-router-dom';

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1400&q=80',
  reading: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80',
  play: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1000&q=80',
  art: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80',
  blocks: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=80',
  outdoor: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1000&q=80'
};

const benefits = [
  { title: 'Letter-sound mapping', text: 'Children connect graphemes to phonemes with picture-rich practice.', color: 'bg-sun' },
  { title: 'Blending confidence', text: 'Short, joyful drills turn sounds into real words they can read.', color: 'bg-sky' },
  { title: 'Home-friendly PDFs', text: 'Print or tablet-ready pages that fit busy family routines.', color: 'bg-leaf' },
  { title: 'Grown-up simple', text: 'Clear instructions so parents and tutors can jump in immediately.', color: 'bg-mango' }
];

const journey = [
  { step: '1', title: 'Hear it', text: 'Start with songs, mouth shapes and listening games.' },
  { step: '2', title: 'See it', text: 'Match letters, pictures and beginning sounds.' },
  { step: '3', title: 'Blend it', text: 'Slide sounds together into CVC words and stories.' },
  { step: '4', title: 'Read it', text: 'Celebrate fluency with decodable mini-books.' }
];

const testimonials = [
  { name: 'Amina, parent', quote: 'My five-year-old asks for “sound time” every afternoon. The pages feel like a game.' },
  { name: 'Mr. Keller, teacher', quote: 'I use the blending pack in small groups. The illustrations keep everyone engaged.' },
  { name: 'Priya, tutor', quote: 'EUR and INR pricing made it easy to share packs with families I support.' }
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2">
        <div>
          <p className="inline-block rounded-full bg-sun px-4 py-1 text-sm font-extrabold text-sky-900">
            Colourful phonics for curious kids
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-sky-800 sm:text-6xl">
            Kids Phonics Academy
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-700">
            Bright PDF workbooks that turn letters into sounds, sounds into words, and words into proud little readers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/resources" className="rounded-full bg-mango px-6 py-3 font-extrabold text-white shadow-lg">
              View Resources
            </Link>
            <Link to="/contact" className="rounded-full bg-sky px-6 py-3 font-extrabold text-white shadow-lg">
              Contact Us
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="blob absolute -left-6 -top-6 h-40 w-40 bg-sun/70" />
          <div className="blob absolute -bottom-8 -right-4 h-36 w-36 bg-leaf/60" />
          <img
            src={IMAGES.hero}
            alt="Child learning with colourful letters"
            className="relative z-10 aspect-[4/3] w-full rounded-[2.5rem] border-8 border-white object-cover shadow-2xl"
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-2">
        <img src={IMAGES.reading} alt="Child reading phonics book" className="h-80 w-full rounded-[2rem] object-cover shadow-xl" />
        <div className="rounded-[2rem] bg-white p-8 shadow-xl">
          <h2 className="font-display text-3xl text-sky-800">What is phonics?</h2>
          <p className="mt-4 text-slate-700">
            Phonics is the friendly science of how letters stand for sounds. When children can hear a sound, see the
            letter, and blend those pieces together, reading stops feeling like a puzzle and starts feeling like play.
          </p>
          <p className="mt-3 text-slate-700">
            Our packs follow that journey with illustrations, tracing, matching and tiny stories designed for ages 4–8.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-center font-display text-3xl text-sky-800">Why families love phonics</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => (
            <article key={item.title} className={`${item.color} rounded-3xl p-5 text-sky-950 shadow-md`}>
              <h3 className="font-display text-xl">{item.title}</h3>
              <p className="mt-2 text-sm font-semibold">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-center font-display text-3xl text-sky-800">A joyful learning journey</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {journey.map((item) => (
            <article key={item.step} className="rounded-3xl bg-white p-5 text-center shadow-lg">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sky font-display text-2xl text-white">
                {item.step}
              </span>
              <h3 className="mt-3 font-display text-xl">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:grid-cols-3">
        <img src={IMAGES.play} alt="Kids exploring books together" className="h-56 w-full rounded-3xl object-cover shadow-lg" />
        <img src={IMAGES.art} alt="Creative kids learning with colour" className="h-56 w-full rounded-3xl object-cover shadow-lg" />
        <img src={IMAGES.blocks} alt="Children building with colourful blocks" className="h-56 w-full rounded-3xl object-cover shadow-lg" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-center font-display text-3xl text-sky-800">Happy voices</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote key={item.name} className="rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-slate-700">“{item.quote}”</p>
              <footer className="mt-4 font-extrabold text-mango">{item.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto mb-8 max-w-6xl overflow-hidden rounded-[2.5rem] bg-leaf px-6 py-12 text-center text-white shadow-xl">
        <img src={IMAGES.outdoor} alt="" className="mx-auto mb-6 h-40 w-40 rounded-full border-4 border-white object-cover" />
        <h2 className="font-display text-4xl">Ready to start sounding out?</h2>
        <p className="mx-auto mt-3 max-w-2xl">Browse 100+ phonics PDFs as the library grows — search, filter and buy in a few taps.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/resources" className="rounded-full bg-sun px-6 py-3 font-extrabold text-sky-900">
            View Resources
          </Link>
          <Link to="/contact" className="rounded-full bg-white px-6 py-3 font-extrabold text-leaf">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
