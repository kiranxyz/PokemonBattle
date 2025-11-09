import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Move = {
  name: string;
  power: number;
  type: string;
};

type Pokemon = {
  id: number;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  type: string;
  sprite: string;
  moves: Move[];
};

// ---- Pokémon Data ----
const POKEMON_LIST: Pokemon[] = [
  {
    id: 25,
    name: "Pikachu",
    hp: 35,
    maxHp: 35,
    attack: 55,
    defense: 40,
    speed: 90,
    type: "Electric",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    moves: [
      { name: "Thunderbolt", power: 90, type: "Electric" },
      { name: "Quick Attack", power: 40, type: "Normal" },
      { name: "Iron Tail", power: 75, type: "Steel" },
      { name: "Electro Ball", power: 80, type: "Electric" },
    ],
  },
  {
    id: 1,
    name: "Bulbasaur",
    hp: 45,
    maxHp: 45,
    attack: 49,
    defense: 49,
    speed: 45,
    type: "Grass",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    moves: [
      { name: "Vine Whip", power: 45, type: "Grass" },
      { name: "Tackle", power: 40, type: "Normal" },
      { name: "Razor Leaf", power: 55, type: "Grass" },
      { name: "Sludge Bomb", power: 65, type: "Poison" },
    ],
  },
  {
    id: 4,
    name: "Charmander",
    hp: 39,
    maxHp: 39,
    attack: 52,
    defense: 43,
    speed: 65,
    type: "Fire",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    moves: [
      { name: "Flamethrower", power: 90, type: "Fire" },
      { name: "Scratch", power: 40, type: "Normal" },
      { name: "Ember", power: 60, type: "Fire" },
      { name: "Slash", power: 70, type: "Normal" },
    ],
  },
];

// ---- Utility ----
const typeEffectiveness = (
  attackType: string,
  defenderType: string
): number => {
  const chart: Record<string, Record<string, number>> = {
    Electric: { Water: 2, Grass: 0.5 },
    Grass: { Water: 2, Fire: 0.5 },
    Fire: { Grass: 2, Water: 0.5 },
    Water: { Fire: 2, Grass: 0.5 },
  };
  return chart[attackType]?.[defenderType] ?? 1;
};

// ---- Sound helper ----
const playSound = (url: string) => {
  const audio = new Audio(url);
  audio.volume = 0.5;
  audio.play();
};

// ---- Component ----
const PokemonBattle2: React.FC = () => {
  const [player, setPlayer] = useState<Pokemon | null>(null);
  const [enemy, setEnemy] = useState<Pokemon | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("Choose your Pokémon!");
  const [attacking, setAttacking] = useState<string | null>(null);
  const [battleOver, setBattleOver] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  // ---- Submit score to leaderboard API ----
  const submitScore = async (username: string, score: number) => {
    try {
      await fetch(
        `${import.meta.env.VITE_APP_Pokemon_Battle_API_URL}/api/leaderboard`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: username, username, score }),
        }
      );
      console.log("✅ Score submitted:", username, score);

      // Update local scores
      setScores((prev) => ({ ...prev, [username]: score }));
    } catch (err) {
      console.error("❌ Failed to submit score", err);
    }
  };

  // ---- Load saved state ----
  useEffect(() => {
    const savedPokemon = localStorage.getItem("selectedPokemon");
    const savedScores = localStorage.getItem("pokemonScores");

    if (savedScores) setScores(JSON.parse(savedScores));

    if (savedPokemon) {
      const p = POKEMON_LIST.find((x) => x.name === savedPokemon);
      if (p) {
        setPlayer({ ...p });
        const enemies = POKEMON_LIST.filter((x) => x.name !== p.name);
        const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
        setEnemy({ ...randomEnemy });
        setMessage(`A wild ${randomEnemy.name} appeared!`);
      }
    }
    setLoadingLeaderboard(false);
  }, []);

  // ---- Save scores persistently ----
  useEffect(() => {
    localStorage.setItem("pokemonScores", JSON.stringify(scores));
  }, [scores]);

  const handleChoosePokemon = (chosen: Pokemon) => {
    const enemies = POKEMON_LIST.filter((p) => p.name !== chosen.name);
    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    setPlayer({ ...chosen });
    setEnemy({ ...randomEnemy });
    setMessage(
      `You chose ${chosen.name}! A wild ${randomEnemy.name} appeared!`
    );
    localStorage.setItem("selectedPokemon", chosen.name);
    playSound("/sounds/start.mp3");
  };

  const calcDamage = (
    attacker: Pokemon,
    defender: Pokemon,
    move: Move
  ): number => {
    let baseDamage = move.power + attacker.attack - defender.defense;
    baseDamage = Math.max(baseDamage, 1);
    const eff = typeEffectiveness(move.type, defender.type);
    return Math.floor(baseDamage * eff);
  };

  // ---- Attack handler with leaderboard submission ----
  const attack = (
    attacker: Pokemon,
    defender: Pokemon,
    setDefender: React.Dispatch<React.SetStateAction<Pokemon | null>>,
    move: Move
  ) => {
    if (!defender || battleOver) return;

    setAttacking(attacker.name);
    playSound("/sounds/attack.mp3");

    setTimeout(() => setAttacking(null), 400);

    const damage = calcDamage(attacker, defender, move);
    const newHP = Math.max(defender.hp - damage, 0);
    setDefender({ ...defender, hp: newHP });

    const eff = typeEffectiveness(move.type, defender.type);
    let text = `${attacker.name} used ${move.name}!`;
    if (eff > 1) text += " It’s super effective!";
    else if (eff < 1) text += " It’s not very effective.";
    text += ` (${damage} damage)`;

    setLog((prev) => [text, ...prev]);
    setMessage(text);

    // ---- Handle faint ----
    if (newHP <= 0) {
      playSound("/sounds/faint.mp3");
      setBattleOver(true);
      setMessage(`${defender.name} fainted! ${attacker.name} wins!`);

      // Submit random score for winner
      const score = Math.floor(Math.random() * 1000);
      submitScore(attacker.name, score);
    }
  };

  // ---- Render JSX ----
  const topScores = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">Pokémon Battle</h2>
      <p className="mb-2">{message}</p>

      {!player && (
        <div className="flex gap-4">
          {POKEMON_LIST.map((p) => (
            <button
              key={p.id}
              onClick={() => handleChoosePokemon(p)}
              className="border p-2 rounded bg-yellow-100 hover:bg-yellow-200"
            >
              <img src={p.sprite} alt={p.name} />
              <p>{p.name}</p>
            </button>
          ))}
        </div>
      )}

      {player && enemy && (
        <div className="flex flex-col items-center mt-4">
          <div className="flex gap-8 items-center">
            <div className="text-center">
              <img src={player.sprite} alt={player.name} />
              <p>
                {player.name} HP: {player.hp}/{player.maxHp}
              </p>
            </div>

            <div className="text-center">
              <img src={enemy.sprite} alt={enemy.name} />
              <p>
                {enemy.name} HP: {enemy.hp}/{enemy.maxHp}
              </p>
            </div>
          </div>

          {!battleOver && (
            <div className="mt-4 flex flex-wrap gap-2">
              {player.moves.map((move) => (
                <button
                  key={move.name}
                  onClick={() => attack(player, enemy, setEnemy, move)}
                  className="bg-blue-200 hover:bg-blue-300 rounded px-3 py-1"
                >
                  {move.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Leaderboard */}
      <div className="mt-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Leaderboard 🏆</h3>
        {topScores.length === 0 ? (
          <p>No scores yet</p>
        ) : (
          <ul className="bg-gray-100 p-2 rounded">
            {topScores.map(([name, score], idx) => (
              <li key={name} className="flex justify-between">
                <span>
                  {idx + 1}. {name}
                </span>
                <span>{score}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PokemonBattle2;
