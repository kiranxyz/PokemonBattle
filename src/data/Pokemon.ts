const BATTLE_API_URL: string | undefined = import.meta.env
  .VITE_APP_Pokemon_Battle_API_URL as string | undefined;
if (!BATTLE_API_URL)
  throw new Error(
    "VITE_APP_Pokemon_Battle_API_URL is required, are you missing a .env file?"
  );
const baseURL: string = `${BATTLE_API_URL}/pokemon`;

const getTeam = async (userId: string): Promise<PokemonInput[]> => {
  if (!userId) {
    console.log("User id is missing to fetch user Team");
    return [];
  }
  const response = await fetch(`${baseURL}/${userId}`);
  if (!response.ok) throw new Error("Error while fetching pokemon team");
  const data = await response.json();

  return data.pokemons;
};

const addToTeam = async (pokemonInput) => {
  try {
    const response = await fetch(`${baseURL}/store`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(pokemonInput),
    });

    if (!response.ok) {
      // Throw an error with the status code for easier handling
      const error = new Error(`HTTP ${response.status}`);
      (error as any).status = response.status;
      throw error;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

export { getTeam, addToTeam };
