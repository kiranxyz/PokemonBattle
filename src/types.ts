declare global {
  type Pokemon = {
    name: string;
    url: string;
    image?: string;
  };

  type PokemonInput = Pokemon & {
    id: string;
    userId: string;
    sprites: string;
    type?: string;
    height?: number;
    weight?: number;
    stats?: number;
    hp?: number;
    attack?: number;
    defense?: number;
    specialattack?: number;
    specialdefence?: number;
    speed?: number;
    abilities?: string[];
  };

  type Team = {
    team: PokemonInput[];
  };

  type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
  };

  type AuthContextType = {
    loading: boolean;
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
  };
}
