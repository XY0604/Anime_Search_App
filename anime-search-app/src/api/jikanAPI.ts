import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const jikanClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

let requestQueue: Array<() => Promise<any>> = [];
let isProcessingQueue = false;

// Process queue with delay between requests
const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (request) {
      try {
        await request();
      } catch (error) {
        console.error('Error processing queued request:', error);
      }
      // 1 second delay between requests
      await delay(1000);
    }
  }
  
  isProcessingQueue = false;
};

// Queue and process requests
const queueRequest = (requestFn: () => Promise<any>): Promise<any> => {
  return new Promise((resolve, reject) => {
    const wrappedRequest = async () => {
      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    
    requestQueue.push(wrappedRequest);
    processQueue();
  });
};


export const searchAnime = async (query: string, page = 1) => {
  return queueRequest(() => 
    jikanClient.get('/anime', {
      params: {
        q: query,
        page,
        orderby: 'score',
        sort: 'desc',
      },
    }).then(res => res.data)
  );
};

export const getAnimeById = async (id: number) => {
  return queueRequest(() => 
    jikanClient.get(`/anime/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching anime by ID:', error);
        throw error;
      })
  );
};

export const getAllAnime = async (page = 1) => {
  return queueRequest(() => 
    jikanClient.get('/top/anime', {
      params: {
        page,
      },
    }).then(res => res.data)
  );
};

export const getPopularAnime = async (page = 1) => {
  return queueRequest(() => 
    jikanClient.get('/anime', {
      params: {
        order_by: 'popularity',
        sort: 'asc',
        page,
      },
    }).then(res => res.data)
  );
};

export const getTopAiringAnime = async (page = 1) => {
  return queueRequest(() => 
    jikanClient.get('/anime', {
      params: {
        status: 'airing',
        order_by: 'score',
        sort: 'desc',
        page,
      },
    }).then(res => res.data)
  );
};

export const getTopUpcomingAnime = async (page = 1) => {
  return queueRequest(() => 
    jikanClient.get('/anime', {
      params: {
        status: 'upcoming',
        order_by: 'popularity',
        sort: 'asc',
        page,
      },
    }).then(res => res.data)
  );
};

export const getAnimeCharacters = async (id = 1) => {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
    
    if (!response.ok) {
      throw new Error(`Error fetching anime characters: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getAnimeCharacters:', error);
    throw error;
  }
};

export const getAnimeEpisodes = async (id = 1, page = 1) => {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/episodes?page=${page}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching anime episodes: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getAnimeEpisodes:', error);
    throw error;
  }
};

export const getAnimeReviews = async (id = 1, page = 1) => {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/reviews?page=${page}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching anime reviews: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getAnimeReviews:', error);
    throw error;
  }
};