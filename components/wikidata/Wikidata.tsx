"use client";

import { useState } from "react";

type Result = {
  id: string;
  label: string;
  description?: string;
  imageUrl?: string;
};

export default function Wikidata() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  async function searchWikidata() {
    if (!query) return;

    setLoading(true);
    setResults([]);

    try {
      // 1️⃣ search entity
      const searchRes = await fetch(
        `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(
          query
        )}&language=en&format=json&origin=*`
      );

      const searchData = await searchRes.json();

      const entities = searchData.search?.slice(0, 6) || [];

      // 2️⃣ get image for each entity
      const withImages = await Promise.all(
        entities.map(async (entity: any) => {
          const entityId = entity.id;

          const entityRes = await fetch(
            `https://www.wikidata.org/wiki/Special:EntityData/${entityId}.json`
          );

          const entityData = await entityRes.json();

          const claims = entityData.entities[entityId].claims;

          // P18 = image property
          const imageName =
            claims?.P18?.[0]?.mainsnak?.datavalue?.value ?? null;

          let imageUrl = undefined;

          if (imageName) {
            // convert file name to Wikimedia image url
            const fileName = imageName.replace(/ /g, "_");
            imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${fileName}?width=400`;
          }

          return {
            id: entityId,
            label: entity.label,
            description: entity.description,
            imageUrl,
          };
        })
      );

      setResults(withImages);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Wikidata Universal Image Search</h2>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anything: Taylor Swift, Fight Club, Designer..."
          style={{ padding: 10, width: 300 }}
        />

        <button onClick={searchWikidata}>Search</button>
      </div>

      {loading && <p>Loading...</p>}

      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 200px)",
          gap: 20,
        }}
      >
        {results.map((item) => (
          <div key={item.id}>
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.label}
                style={{
                  width: 200,
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 12,
                }}
              />
            ) : (
              <div
                style={{
                  width: 200,
                  height: 200,
                  background: "#eee",
                  borderRadius: 12,
                }}
              />
            )}

            <h4>{item.label}</h4>
            <p style={{ fontSize: 12, opacity: 0.7 }}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}