import { useEffect, useState } from "react";
import { Link } from "react-router";
import { addToTeam } from "@/data";
import { useAuthContext } from "@/contexts";
import { toast } from "react-toastify";

const PokemonCard = ({ name, url }: PokemonInput) => {
  const { user } = useAuthContext();

  const [image, setImage] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [pokemon, setPokemon] = useState<PokemonInput | {}>({});

  useEffect(() => {
    const fetchPokemon = async () => {
      const resposne = await fetch(url);
      if (!resposne.ok) throw new Error("Api response error");
      const data = await resposne.json();
      setImage(data.sprites.front_default);
      setType(data.types[0].type.name);
      setId(data.id);
      setPokemon({
        userId: user?.id,
        id: data.id,
        name: name,
        type: data.types[0].type.name,
        sprites: data.sprites.front_default,
        height: data.height,
        weight: data.weight,
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        specialattack: data.stats[3].base_stat,
        specialdefence: data.stats[4].base_stat,
        speed: data.stats[5].base_stat,
        //abilities: string[];
      });
    };
    fetchPokemon();
  }, []);

  const savePokemon = async () => {
    //Will call an api to add this pokemon team, but need to check it should not alread be in team
    if (!user) {
      alert(`Please login to make this pokemon as a team member.`);
      return;
    }
    console.log("Pokemon to Save : ", pokemon);
    try {
      await addToTeam(pokemon);
      toast.success("Sucssfully added to team");
    } catch (error: any) {
      if (error.status === 409) {
        toast.error("This Pokémon is already in your team ⚠️");
      } else {
        toast.error("Something went wrong. Please try again ❌");
      }
    }
  };
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="bg-white h-48">
        <img src={image} alt={name} className="object-cover h-full w-full" />
      </figure>
      <div className="card-body h-56">
        <h2 className="card-title">{name}</h2>
        <h3>Type : {type}</h3>
        <Link to={`/pkdetail/${id}`} className="btn btn-primary mt-4">
          View details
        </Link>
        <Link to={url} className="btn btn-primary mt-4">
          View details Url
        </Link>
        {user && (
          <button onClick={savePokemon} className="btn btn-ghost">
            Add to Team
          </button>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;
