import { connectDb } from '../config/db.js';
import { Product } from '../models/Product.js';
import { ProductAnalytics } from '../models/ProductAnalytics.js';
import { SiteSettings } from '../models/SiteSettings.js';

const DUMMY_PDF = 'https://res.cloudinary.com/demo/image/upload/sample.pdf';

const IMAGES = {
  phonicsBasic: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
  phonicsAdvanced: 'https://images.unsplash.com/photo-1588072432836-e10032774343?auto=format&fit=crop&w=900&q=80',
  age4: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80',
  age6: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=900&q=80',
  age8: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=900&q=80'
};

const SUBCATEGORIES = [
  { category: 'phonics', subCategory: 'basic' },
  { category: 'phonics', subCategory: 'advanced' },
  { category: 'brain-exercise', subCategory: 'age4to6' },
  { category: 'brain-exercise', subCategory: 'age6to8' },
  { category: 'brain-exercise', subCategory: 'age8plus' }
];

const DUMMY_TEMPLATES = {
  'phonics:basic': {
    prefix: 'PHO-B',
    titles: ['Alphabet Foundations', 'Letter Sound Play Pack', 'First Phonics Tracing Book'],
    description: 'A colourful starter pack for letter sounds, tracing and early blending.',
    thumbnailUrl: IMAGES.phonicsBasic,
    priceEUR: 5,
    priceINR: 450
  },
  'phonics:advanced': {
    prefix: 'PHO-A',
    titles: ['Advanced Blending Skills', 'Digraph Detective Club', 'Fluent Reader Challenge'],
    description: 'Stretch blending, digraphs and fluency for confident young readers.',
    thumbnailUrl: IMAGES.phonicsAdvanced,
    priceEUR: 7,
    priceINR: 649
  },
  'brain-exercise:age4to6': {
    prefix: 'BRN-A',
    titles: ['Brain Gym Fun Pack', 'Focus Friends Workbook', 'Little Thinkers Activities'],
    description: 'Playful concentration and memory games for ages 4 to 6.',
    thumbnailUrl: IMAGES.age4,
    priceEUR: 6,
    priceINR: 549
  },
  'brain-exercise:age6to8': {
    prefix: 'BRN-B',
    titles: ['Memory Challenge Pack', 'Logic Lab Worksheets', 'Attention Superstars'],
    description: 'Puzzles that build memory and flexible thinking for ages 6 to 8.',
    thumbnailUrl: IMAGES.age6,
    priceEUR: 6.5,
    priceINR: 599
  },
  'brain-exercise:age8plus': {
    prefix: 'BRN-C',
    titles: ['Advanced Thinking Skills', 'Brain Boost Challenge', 'Critical Thinking Gym'],
    description: 'Deeper reasoning and working-memory workouts for ages 8 and up.',
    thumbnailUrl: IMAGES.age8,
    priceEUR: 8,
    priceINR: 749
  }
};

function looksLikeBrainExercise(product) {
  const blob = `${product.productCode} ${product.title} ${product.category} ${product.description}`.toLowerCase();
  return (
    blob.includes('brain') ||
    blob.includes('gym') ||
    blob.includes('cognitive') ||
    blob.includes('memory challenge') ||
    product.category === 'brain-exercise'
  );
}

function inferSubCategory(product, category) {
  const allowed = new Set(['basic', 'advanced', 'age4to6', 'age6to8', 'age8plus']);
  if (allowed.has(product.subCategory)) return product.subCategory;

  const blob = `${product.productCode} ${product.title} ${product.category}`.toLowerCase();
  if (category === 'brain-exercise') {
    if (blob.includes('8+') || blob.includes('8plus') || blob.includes('age 8') || blob.includes('age8')) {
      return 'age8plus';
    }
    if (blob.includes('6-8') || blob.includes('6 to 8') || blob.includes('age6')) {
      return 'age6to8';
    }
    return 'age4to6';
  }

  const advancedHints = ['advanced', 'digraph', 'blend', 'fluency', 'story', 'magic e', 'long vowel'];
  if (advancedHints.some((hint) => blob.includes(hint))) return 'advanced';
  return 'basic';
}

async function migrateExistingProducts() {
  const products = await Product.find({}).lean();
  let updated = 0;

  for (const product of products) {
    const category = looksLikeBrainExercise(product) ? 'brain-exercise' : 'phonics';
    const subCategory = inferSubCategory(product, category);
    if (product.category === category && product.subCategory === subCategory) continue;

    await Product.collection.updateOne(
      { _id: product._id },
      { $set: { category, subCategory } }
    );
    updated += 1;
  }

  return { scanned: products.length, updated };
}

async function ensureDummyProducts() {
  const created = [];

  for (const { category, subCategory } of SUBCATEGORIES) {
    const count = await Product.countDocuments({ category, subCategory });
    const needed = Math.max(0, 3 - count);
    if (!needed) continue;

    const key = `${category}:${subCategory}`;
    const template = DUMMY_TEMPLATES[key];

    for (let index = 0; index < needed; index += 1) {
      const slot = count + index + 1;
      const productCode = `${template.prefix}-${String(slot).padStart(3, '0')}`;
      const exists = await Product.findOne({ productCode });
      if (exists) continue;

      const title = template.titles[(slot - 1) % template.titles.length];
      const product = await Product.create({
        productCode,
        title: existsTitle(title, slot),
        description: template.description,
        category,
        subCategory,
        priceEUR: template.priceEUR,
        priceINR: template.priceINR,
        thumbnailUrl: template.thumbnailUrl,
        pdfUrl: DUMMY_PDF,
        active: true
      });
      await ProductAnalytics.updateOne(
        { productId: product._id },
        { $setOnInsert: { views: 0, purchases: 0, downloads: 0 } },
        { upsert: true }
      );
      created.push(product.productCode);
    }
  }

  return created;
}

function existsTitle(title, slot) {
  return slot <= 3 ? title : `${title} ${slot}`;
}

async function ensureSiteSettings() {
  const existing = await SiteSettings.findOne();
  if (existing) return false;
  await SiteSettings.create({
    facebookUrl: '',
    instagramUrl: '',
    contactEmail: '',
    phoneNumber: ''
  });
  return true;
}

async function migrate() {
  await connectDb();
  const existing = await migrateExistingProducts();
  const dummyCodes = await ensureDummyProducts();
  const settingsCreated = await ensureSiteSettings();
  const counts = {};
  for (const { category, subCategory } of SUBCATEGORIES) {
    counts[`${category}/${subCategory}`] = await Product.countDocuments({ category, subCategory });
  }

  console.log('Migration complete.');
  console.log(`Existing products scanned: ${existing.scanned}, category/subCategory updated: ${existing.updated}`);
  console.log(`Dummy products inserted: ${dummyCodes.length || 0}`, dummyCodes);
  console.log('SiteSettings created:', settingsCreated);
  console.log('Counts by category/subCategory:', counts);
  process.exit(0);
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
