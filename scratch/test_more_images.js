const candidateIds = [
  // Falafel candidates
  "photo-1585238342024-78d387f4a707", // falafel / hummus
  "photo-1598514982205-f36b96d1e8d4", // falafel plate
  "photo-1608897013039-887f21d8c804", // falafel
  "photo-1547058886-af77993d452b", // falafel original
  // Wrap candidates
  "photo-1628191139360-408a06492319", // wrap
  "photo-1606755962773-d324e0a13086", // wrap / taco
  "photo-1505576399279-565b52d4ac71", // salad wrap
  "photo-1554524410-30c57bd0409a", // wrap / burrito
  // Chips candidates
  "photo-1534422298391-e4f8c172dddb", // potato chips
  "photo-1528751003003-400c25a6ef0e", // chips
  "photo-1566478989037-eec170784d20", // crisps original
  "photo-1613967193442-19cfb7705151"  // crisps original 2
];

async function check() {
  for (const id of candidateIds) {
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=350&q=80`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(`${id} -> ${res.status}`);
    } catch (err) {
      console.log(`${id} -> ERROR: ${err.message}`);
    }
  }
}

check();
