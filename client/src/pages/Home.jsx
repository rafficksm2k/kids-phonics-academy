import { Link } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1400&q=80',
  thinking: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=80',
  play: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1000&q=80',
  art: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80',
  blocks: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=80',
  outdoor: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1000&q=80'
};

const features = [
  { icon: '🧠', title: 'Brain Gym Activities', text: 'Build memory, focus and thinking skills.', color: 'bg-sun' },
  { icon: '🧩', title: 'Logic & Puzzle Challenges', text: 'Encourage problem-solving and reasoning.', color: 'bg-sky' },
  { icon: '🎯', title: 'Focus & Attention Training', text: 'Improve concentration through fun tasks.', color: 'bg-leaf' },
  { icon: '🚀', title: 'Brain Development Workbooks', text: 'Printable PDF activities for growing minds.', color: 'bg-mango' }
];

const journey = [
  { step: '1', title: 'Warm up', text: 'Start with playful brain gym games that wake up attention.' },
  { step: '2', title: 'Focus', text: 'Practise memory, visual perception and concentration in short bursts.' },
  { step: '3', title: 'Think', text: 'Stretch logic, problem-solving and flexible thinking.' },
  { step: '4', title: 'Grow', text: 'Celebrate progress with creative challenges children want to repeat.' }
];

const testimonials = [
  { name: 'Amina, parent', quote: 'Brain gym time is the favourite part of our afternoon. She asks for one more puzzle every day.' },
  { name: 'Mr. Keller, teacher', quote: 'The focus packs work beautifully in small groups. Children stay curious and calm.' },
  { name: 'Priya, tutor', quote: 'Parents love the playful PDF workbooks. Memory and thinking skills are growing together.' }
];

export default function Home() {
  const settings = useSiteSettings();
  const heroImage = settings.heroBannerUrl || '../src/assets/images/brain_gym.webp';
  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2">
        <div>
          <p className="inline-block rounded-full bg-sun px-4 py-1 text-sm font-extrabold text-sky-900">
            Brain development activities for curious kids
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-sky-800 sm:text-6xl">
            Unlock Your Child's Potential
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-700">
            Discover engaging brain gym activities, cognitive development worksheets and creative learning resources
            designed to strengthen memory, focus, concentration and problem-solving skills.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/resources" className="rounded-full bg-mango px-6 py-3 font-extrabold text-white shadow-lg">
              Browse Resources
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
            src={heroImage}
            alt="Children exploring colourful brain-building activities"
            className="relative z-10 aspect-[4/3] w-full rounded-[2.5rem] border-8 border-white object-cover shadow-2xl"
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-2">
        <img src="../src/assets/images/puzzle.jpg" alt="Child building thinking skills through play" className="w-full h-auto object-contain" />
        <div className="rounded-[2rem] bg-white p-8 shadow-xl">
          <h2 className="font-display text-3xl text-sky-800">Building strong thinking skills</h2>
          <p className="mt-4 text-slate-700">
            Bright Minds Academy is a learning platform that helps children think, learn, focus, explore and grow.
            Our playful PDF workbooks turn brain training into a game — with memory activities, concentration
            exercises and critical-thinking challenges designed for young minds.
          </p>
          <p className="mt-3 text-slate-700">
            Families use our packs for early cognitive development, visual perception, logical thinking and creative
            learning through play. Phonics resources are available too, as a secondary collection inside Resources.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-center font-display text-3xl text-sky-800">Fun brain challenges they will love</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => (
            <article key={item.title} className={`${item.color} rounded-3xl p-5 text-sky-950 shadow-md`}>
              <p className="text-3xl">{item.icon}</p>
              <h3 className="mt-2 font-display text-xl">{item.title}</h3>
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

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl">
          <h2 className="font-display text-3xl text-sky-800">Playful PDF workbooks</h2>
          <p className="mt-4 max-w-3xl text-slate-700">
            Print or use on a tablet. Every pack is built for brain training — memory activities, concentration
            exercises, critical thinking and cognitive development — so growing minds can practise a little every day.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:grid-cols-3">
        <img src="../src/assets/images/brain.png" alt="Kids exploring learning activities together" className="h-56 w-full object-contain" />
        <img src="../src/assets/images/table.jpg" alt="Creative kids learning through colour and play" className="w-full h-56 object-contain" />
        <img src="../src/assets/images/draw.jpg" alt="Children building with colourful blocks" className="h-56 w-full rounded-3xl object-cover shadow-lg" />
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
        <h2 className="font-display text-4xl">Ready to build a brighter mind?</h2>
        <p className="mx-auto mt-3 max-w-2xl">
          Explore brain gym worksheets, memory and focus activities, and creative learning through play — with phonics
          packs waiting as an extra collection.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/resources" className="rounded-full bg-sun px-6 py-3 font-extrabold text-sky-900">
            Browse Resources
          </Link>
          <Link to="/contact" className="rounded-full bg-white px-6 py-3 font-extrabold text-leaf">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
