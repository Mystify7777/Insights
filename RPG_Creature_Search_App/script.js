const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

const nameEl = document.getElementById("creature-name");
const idEl = document.getElementById("creature-id");
const weightEl = document.getElementById("weight");
const heightEl = document.getElementById("height");
const typesEl = document.getElementById("types");

const hpEl = document.getElementById("hp");
const attackEl = document.getElementById("attack");
const defenseEl = document.getElementById("defense");
const spAttackEl = document.getElementById("special-attack");
const spDefenseEl = document.getElementById("special-defense");
const speedEl = document.getElementById("speed");

const fetchCreature = async (query) => {
  try {
    const res = await fetch(
      `https://rpg-creature-api.freecodecamp.rocks/api/creature/${query.toLowerCase()}`
    );

    if (!res.ok) throw new Error();

    const data = await res.json();

    // Fill UI
    nameEl.textContent = data.name.toUpperCase();
    idEl.textContent = `#${data.id}`;
    weightEl.textContent = data.weight;
    heightEl.textContent = data.height;

    // Clear previous types
    typesEl.innerHTML = "";

    data.types.forEach(t => {
      const el = document.createElement("span");
      el.textContent = t.name.toUpperCase();
      typesEl.appendChild(el);
    });

    // Stats
    hpEl.textContent = data.stats[0].base_stat;
    attackEl.textContent = data.stats[1].base_stat;
    defenseEl.textContent = data.stats[2].base_stat;
    spAttackEl.textContent = data.stats[3].base_stat;
    spDefenseEl.textContent = data.stats[4].base_stat;
    speedEl.textContent = data.stats[5].base_stat;

  } catch {
    alert("Creature not found");
  }
};

searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchCreature(query);
});