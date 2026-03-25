import { Product, Order } from './types';

const categories = ['Home', 'Outdoor', 'Fashion', 'Groceries', 'Electronics', 'Beauty', 'Stationery'];

// Deep mapping of specific nouns to unique Unsplash IDs to ensure perfect visual matching
const nounImagePools: Record<string, string[]> = {
  'Pillow': ['photo-1584108656821-afc295439481', 'photo-1629949009765-40f24c694a92', 'photo-1522771739844-6a9f6d5f14af'],
  'Lamp': ['photo-1513519245088-0e12902e5a38', 'photo-1534073828943-f801091bb18c', 'photo-1507473885765-e6ed057f782c'],
  'Chair': ['photo-1581672336914-947cd72f5d71', 'photo-1592078615290-033ee584e267', 'photo-1503602642458-232111445657'],
  'Rug': ['photo-1531835277274-b248f6e8e98c', 'photo-1600166898405-da9535204843', 'photo-1575414003591-ece8d0416c7a'],
  'Bowl': ['photo-1610832958506-ee5636637671', 'photo-1574362848149-11496d93a7c7', 'photo-1594910413916-4444a203f641'],
  'Backpack': ['photo-1553062407-98eeb64c6a62', 'photo-1622560480605-d83c853bc5c3', 'photo-1581605405669-fcdf81165afa'],
  'Bottle': ['photo-1602143399827-bd9596a7276c', 'photo-1523362628745-0c100150b504', 'photo-1589365278144-c9e705f843ba'],
  'Tent': ['photo-1504280390367-361c6d9f38f4', 'photo-1523987355523-c7b5b0dd90a7', 'photo-1478131143081-80f7f84ca84d'],
  'Kayak': ['photo-1544551763-47a0159f963f', 'photo-1517030330234-94c4fa9fc8ca', 'photo-1471079688237-3ac9a55f1d6f'],
  'Lantern': ['photo-1533675323005-24b6069b1736', 'photo-1513909581282-7894e663a0a8', 'photo-1520633857323-86c23030d931'],
  'Shirt': ['photo-1521572163474-6864f9cf17ab', 'photo-1598033129183-c4f50c7176c8', 'photo-1489987707025-afc232f7ea0f'],
  'Hat': ['photo-1521369909029-2afed882baee', 'photo-1533055640609-24b498dfd74c', 'photo-1572307480813-ceb0e59d8325'],
  'Tote': ['photo-1591047134402-234122fb1546', 'photo-1544816155-12df9643f363', 'photo-1622560480654-d92212f4581a'],
  'Sneakers': ['photo-1542291026-7eec264c27ff', 'photo-1560769629-975ec94e6a86', 'photo-1595950653106-6c9ebd614d3a'],
  'Jacket': ['photo-1551028719-00167b16eac5', 'photo-1591047134402-234122fb1546', 'photo-1544022613-e87c7a4b3f99'],
  'Coffee': ['photo-1509042239860-f550ce710b93', 'photo-1495474472287-4d71bcdd2085', 'photo-1507133750040-4a8f571c95af'],
  'Tea': ['photo-1544787210-22bb840c59ef', 'photo-1597481499750-3e6b22637e12', 'photo-1571934811356-5cc061b6821f'],
  'Honey': ['photo-1587049352846-4a222e784d38', 'photo-1558449028-b53a39d100fc', 'photo-1471943311424-646960669fbc'],
  'Granola': ['photo-1517093157656-b9421fc40424', 'photo-1490645935967-10de6ba17051', 'photo-1525059696034-4967a8e1dca2'],
  'Headphones': ['photo-1505740420928-5e560c06d30e', 'photo-1546435770-e323f491f5e4', 'photo-1484704849700-f032a568e944'],
  'Watch': ['photo-1523275335684-37898b6baf30', 'photo-1508685096489-7aacd43bd3b1', 'photo-1542496658-e33a6d0d50f6'],
  'Speaker': ['photo-1608155611251-307401a2e7a9', 'photo-1545454675-3531b543be5d', 'photo-1589003077984-894e133dabab'],
  'Keyboard': ['photo-1511467687858-23d96c32e4ae', 'photo-1560850038-f95185a4bb1d', 'photo-1587829741301-dc798b83add3'],
  'Soap': ['photo-1526947425960-945c6e7393a4', 'photo-1600857544200-b2f666a9a2ec', 'photo-1590439474822-ca9ec9037c88'],
  'Brush': ['photo-1561043433-92751783b24f', 'photo-1506811403042-adbb521415df', 'photo-1619451334792-150fd785ee7b'],
  'Lotion': ['photo-1570172619674-c6c802886e00', 'photo-1620916566398-39f1143f7c9e', 'photo-1556228578-097bc10827f2'],
  'Notebook': ['photo-1519337265831-281ec6cc8514', 'photo-1583485088034-697b5bc54ccd', 'photo-1484480974627-6c36de45ec47'],
  'Pen': ['photo-1585336139118-89c74a10d2a9', 'photo-1583485088034-697b5bc54ccd', 'photo-1511556820780-d912e42b4980'],
  'Planner': ['photo-1516414441443-7551912cbfd2', 'photo-1506784919120-a192f6b31522', 'photo-1533512930330-4ac357ca9082']
};

const categoryToNouns: Record<string, string[]> = {
  'Home': ['Pillow', 'Lamp', 'Chair', 'Rug', 'Bowl'],
  'Outdoor': ['Backpack', 'Bottle', 'Tent', 'Kayak', 'Lantern'],
  'Fashion': ['Shirt', 'Hat', 'Tote', 'Sneakers', 'Jacket'],
  'Groceries': ['Coffee', 'Tea', 'Honey', 'Granola'],
  'Electronics': ['Headphones', 'Watch', 'Speaker', 'Keyboard'],
  'Beauty': ['Soap', 'Brush', 'Lotion'],
  'Stationery': ['Notebook', 'Pen', 'Planner']
};

const adjectives = ['Eco', 'Green', 'Sustainable', 'Pure', 'Natural', 'Zero-Waste', 'Recycled', 'Renewable', 'Earth-Friendly', 'Mindful', 'Clean', 'Organic'];

const baseProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Bamboo Bedding',
    description: 'Ultra-soft, breathable sheets made from 100% sustainable bamboo fibers.',
    fullDescription: 'Our bamboo bedding is OEKO-TEX certified and uses 70% less water than traditional cotton. The moisture-wicking properties ensure a perfect night\'s sleep while staying carbon-neutral.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
    category: 'Home',
    carbonFootprint: 2.4,
    ecoScore: 92,
    shippingOrigin: 'California, USA',
    materials: ['Organic Bamboo', 'Plant-based dyes']
  },
  {
    id: '2',
    name: 'Solar-Powered Adventure Pack',
    description: 'Durable adventure gear with integrated solar panels for charging on the go.',
    fullDescription: 'Constructed from 100% recycled nylon, this backpack features high-efficiency solar cells that can charge a smartphone in 4 hours of direct sunlight. Perfect for the eco-conscious explorer.',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    category: 'Outdoor',
    carbonFootprint: 4.8,
    ecoScore: 85,
    shippingOrigin: 'Regional Hub',
    materials: ['Recycled Nylon', 'Mono-crystalline Solar Cells']
  },
  {
    id: '3',
    name: 'Ocean Plastic Runners',
    description: 'Performance footwear crafted from upcycled marine plastic debris.',
    fullDescription: 'Every pair of these shoes removes approximately 1kg of plastic from our oceans. Designed for high performance and ultimate sustainability.',
    price: 110.00,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    category: 'Fashion',
    carbonFootprint: 3.1,
    ecoScore: 89,
    shippingOrigin: 'Oregon, USA',
    materials: ['Ocean Plastic Yarn', 'Algae-based Foam']
  }
];

// Generate exactly unique products
const additionalProducts: Product[] = [];
const usedNames = new Set(baseProducts.map(p => p.name));
const usedImages = new Set(baseProducts.map(p => p.image.split('/')[3].split('?')[0]));

let idCounter = 10;
for (const cat of categories) {
  const nouns = categoryToNouns[cat] || [];
  for (const noun of nouns) {
    const images = nounImagePools[noun] || ['photo-1506748689174-af200748d1ff'];
    
    // Create 5 unique products for each noun
    for (let j = 0; j < 5; j++) {
      const adj = adjectives[(idCounter + j) % adjectives.length];
      let productName = `${adj} ${noun}`;
      
      // Ensure unique name
      let subCounter = 1;
      while (usedNames.has(productName)) {
        productName = `${adj} ${noun} ${String.fromCharCode(64 + subCounter)}`;
        subCounter++;
      }
      usedNames.add(productName);

      // Select a unique image from the pool if possible, or fallback with unique seed
      const imgId = images[j % images.length];
      const imageUrl = `https://images.unsplash.com/${imgId}?auto=format&fit=crop&q=80&w=800&sig=${idCounter}`;

      additionalProducts.push({
        id: (idCounter++).toString(),
        name: productName,
        description: `A premium ${adj.toLowerCase()} ${noun.toLowerCase()} specifically crafted for ${cat.toLowerCase()} enthusiasts who prioritize sustainability.`,
        fullDescription: `This ${productName} represents the intersection of luxury and environmental responsibility. Designed for longevity and circularity, it utilizes recycled materials and non-toxic dyes.`,
        price: 15 + Math.random() * 100,
        image: imageUrl, 
        category: cat,
        carbonFootprint: parseFloat((Math.random() * 4).toFixed(1)),
        ecoScore: 75 + Math.floor(Math.random() * 25),
        shippingOrigin: 'Eco-Fulfillment Center',
        materials: ['Recycled Content', 'Plant Fibers', 'Biodegradable Components']
      });
    }
  }
}

export const MOCK_PRODUCTS: Product[] = [...baseProducts, ...additionalProducts];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', date: '2024-03-01', customer: 'Alice Green', items: 3, total: 245.50, status: 'delivered', carbonOffset: 12.4 },
  { id: 'ORD-002', date: '2024-03-02', customer: 'Bob Smith', items: 1, total: 89.00, status: 'shipped', carbonOffset: 4.8 },
  { id: 'ORD-003', date: '2024-03-02', customer: 'Charlie Brown', items: 5, total: 412.00, status: 'processing', carbonOffset: 25.1 },
  { id: 'ORD-004', date: '2024-03-03', customer: 'Diana Prince', items: 2, total: 110.00, status: 'delivered', carbonOffset: 3.1 },
  { id: 'ORD-005', date: '2024-03-04', customer: 'Ethan Hunt', items: 1, total: 18.00, status: 'delivered', carbonOffset: 0.2 },
];