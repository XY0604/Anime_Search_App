
export interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url?: string;
      small_image_url?: string;
    };
    webp?: {
      image_url: string;
      large_image_url?: string;
      small_image_url?: string;
    };
  };
  synopsis?: string;
  background?: string;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  year?: number;
  status?: string;
  episodes?: number;
  duration?: string;
  rating?: string;
  season?: string;
  type?: string;
  source?: string;
  aired?: {
    from: string;
    to?: string | null;
  };
  genres?: Array<{ mal_id: number; name: string }>;
  demographics?: Array<{ mal_id: number; name: string }>;
  studios?: Array<{ mal_id: number; name: string }>;
  producers?: Array<{ mal_id: number; name: string }>;
  licensors?: Array<{ mal_id: number; name: string }>;
  broadcast?: {
    day?: string;
    time?: string;
    timezone?: string;
  };
  trailer?: {
    youtube_id?: string;
    url?: string;
    embed_url?: string;
  };
}

export interface Person {
  mal_id: number;
  name: string;
  images?: {
    jpg?: {
      image_url?: string;
    };
  };
}

export interface Character {
  character: {
    mal_id: number;
    name: string;
    images?: {
      jpg?: {
        image_url?: string;
      };
    };
  };
  role?: string;
  voice_actors?: Array<{
    person: Person;
    language: string;
  }>;
}

export interface Episode {
  mal_id: number;
  title?: string;
  episode?: number;
  aired?: string;
  score?: number;
  filler?: boolean;
  recap?: boolean;
  forum_url?: string;
}