import { connectDb } from '../config/db.js';
import { Product } from '../models/Product.js';
import { ProductAnalytics } from '../models/ProductAnalytics.js';

const IMAGES = {
  alphabet:
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
  classroom:
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80',
  reading:
    'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=900&q=80',
  paints:
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80',
  blocks:
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=900&q=80',
  outdoor:
    'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=900&q=80',
  art:
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80',
  letters:
    'https://images.unsplash.com/photo-1588072432836-e10032774343?auto=format&fit=crop&w=900&q=80'
};

const products = [
  {
    productCode: 'PHO-001',
    title: 'Phonics A-Z Workbook',
    description: 'Learn alphabet sounds with tracing, matching and picture cues for every letter.',
    category: 'Alphabet',
    priceEUR: 5,
    priceINR: 450,
    thumbnailUrl: IMAGES.alphabet
  },
  {
    productCode: 'PHO-002',
    title: 'Letter Sounds Safari',
    description: 'A colourful safari of beginning sounds, with animals for each phoneme.',
    category: 'Alphabet',
    priceEUR: 4.5,
    priceINR: 399,
    thumbnailUrl: IMAGES.outdoor
  },
  {
    productCode: 'PHO-003',
    title: 'CVC Word Builders',
    description: 'Blend consonant-vowel-consonant words with cut-and-paste tiles.',
    category: 'CVC Words',
    priceEUR: 6,
    priceINR: 549,
    thumbnailUrl: IMAGES.blocks
  },
  {
    productCode: 'PHO-004',
    title: 'Short Vowel Adventures',
    description: 'Stories and drills for a, e, i, o and u in simple CVC patterns.',
    category: 'Vowels',
    priceEUR: 5.5,
    priceINR: 499,
    thumbnailUrl: IMAGES.reading
  },
  {
    productCode: 'PHO-005',
    title: 'Digraph Detectives',
    description: 'Hunt for sh, ch, th, wh and ck in words, pictures and mini-stories.',
    category: 'Digraphs',
    priceEUR: 6.5,
    priceINR: 599,
    thumbnailUrl: IMAGES.paints
  },
  {
    productCode: 'PHO-006',
    title: 'Blending Bootcamp',
    description: 'Step-by-step blending ladders from 2 sounds to 4 sounds.',
    category: 'Blending',
    priceEUR: 7,
    priceINR: 649,
    thumbnailUrl: IMAGES.classroom
  },
  {
    productCode: 'PHO-007',
    title: 'Sight Word Superstars',
    description: 'High-frequency word practice with games, fluency fans and tracing.',
    category: 'Sight Words',
    priceEUR: 5,
    priceINR: 450,
    thumbnailUrl: IMAGES.letters
  },
  {
    productCode: 'PHO-008',
    title: 'Decodable Story Pack 1',
    description: 'Eight illustrated decodable stories for early readers.',
    category: 'Storybooks',
    priceEUR: 8,
    priceINR: 749,
    thumbnailUrl: IMAGES.reading
  },
  {
    productCode: 'PHO-009',
    title: 'Rhyme Time Worksheets',
    description: 'Fun rhyme families to build phonological awareness at home.',
    category: 'Worksheets',
    priceEUR: 4,
    priceINR: 349,
    thumbnailUrl: IMAGES.art
  },
  {
    productCode: 'PHO-010',
    title: 'Long Vowel Magic e',
    description: 'Silent-e transformations with colour-coded word maps.',
    category: 'Vowels',
    priceEUR: 6,
    priceINR: 549,
    thumbnailUrl: IMAGES.paints
  },
  {
    productCode: 'PHO-011',
    title: 'Beginning Blend Bridges',
    description: 'Practice bl, cl, fl, gl, pl, sl, br, cr, dr, fr, gr, pr and tr.',
    category: 'Blending',
    priceEUR: 6.5,
    priceINR: 599,
    thumbnailUrl: IMAGES.blocks
  },
  {
    productCode: 'PHO-012',
    title: 'Phonics Fluency Pack',
    description: 'Timed reads and smile charts to grow confident, happy readers.',
    category: 'Worksheets',
    priceEUR: 7.5,
    priceINR: 699,
    thumbnailUrl: IMAGES.classroom
  }
];

async function seed() {
  await connectDb();
  await Product.deleteMany({});
  await ProductAnalytics.deleteMany({});

  const created = await Product.insertMany(
    products.map((product) => ({
      ...product,
      pdfUrl: '',
      active: true
    }))
  );

  await ProductAnalytics.insertMany(
    created.map((product) => ({
      productId: product._id,
      views: 0,
      purchases: 0,
      downloads: 0
    }))
  );

  console.log(`Seeded ${created.length} products. Upload PDFs to Cloudinary, then PUT pdfUrl on each product.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
