import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getTeam } from "@/data";
import { useAuthContext } from "@/contexts";
type Move = { name: string; power: number; type: string };
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

const ROSTER: Pokemon[] = [
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
      { name: "Razor Leaf", power: 55, type: "Grass" },
      { name: "Tackle", power: 40, type: "Normal" },
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
      { name: "Ember", power: 50, type: "Fire" },
      { name: "Scratch", power: 40, type: "Normal" },
      { name: "Flame Burst", power: 70, type: "Fire" },
    ],
  },
  {
    id: 7,
    name: "Squirtle",
    hp: 44,
    maxHp: 44,
    attack: 48,
    defense: 65,
    speed: 43,
    type: "Water",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    moves: [
      { name: "Water Gun", power: 50, type: "Water" },
      { name: "Tackle", power: 40, type: "Normal" },
      { name: "Bubble", power: 40, type: "Water" },
    ],
  },
];

const Team = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<PokemonInput[]>([]);

  useEffect(() => {
    const myTeam = async () => {
      try {
        setLoading(false);
        const myTeam = await getTeam(user.id);
        setTeam(myTeam);
        setLoading(true);
      } catch (error) {}
    };
    myTeam();
  }, []);

  console.log("TEAM : ", team);

  const [playerChoice, setPlayerChoice] = useState<Pokemon | null>(ROSTER[0]);
  return (
    <section className="justify-center align">
      <div className="grid grid-cols-1">
        <div className="bg-white rounded-2xl p-4 shadow">
          <h2 className="font-semibold mb-2 text-center text-3xl">
            My Pokémon Team
          </h2>
          <div className="space-y-3">
            {team.map((r) => (
              <div
                key={r.name}
                //onClick={() => setPlayerChoice(r)}
                className={`flex items-center justify-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 border-b border-gray-300 ${
                  playerChoice?.name === r.name
                    ? "ring-3 ring-blue-300 bg-blue-50"
                    : ""
                }`}
              >
                <img src={r.sprites} alt={r.name} className="w-20" />
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-gray-500">
                    {r.type} • HP {r.hp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
