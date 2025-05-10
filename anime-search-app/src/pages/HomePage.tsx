// HomePage with search dropdown functionality
import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Fade,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ClickAwayListener
} from '@mui/material';
import {useNavigate } from 'react-router-dom';
import {
  getAllAnime,
  getPopularAnime,
  getTopAiringAnime,
  getTopUpcomingAnime,
  searchAnime
} from '../api/jikanAPI';
import AnimeCard from '../components/AnimeCard';
import { Search, ArrowForwardIos, ArrowBackIos, Refresh } from '@mui/icons-material';
import backgroundImage from '../assets/cherrytreebackground.jpg';
import type { Anime } from '../components/animeInterface';
import debounce from 'debounce';

const HomePage = () => {
  const [animeData, setAnimeData] = useState<{
    all: Anime[];
    popular: Anime[];
    airing: Anime[];
    upcoming: Anime[];
  }>({
    all: [],
    popular: [],
    airing: [],
    upcoming: []
  });

  const [sectionLoading, setSectionLoading] = useState({
    all: true,
    popular: true,
    airing: true,
    upcoming: true
  });
  
  const [error, setError] = useState<string | null>(null);

  // State for search functionality
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [carouselPositions, setCarouselPositions] = useState({all: 0, airing: 0, popular: 0, upcoming: 0});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const navigate = useNavigate();

  const getVisibleCards = () => (isMobile ? 1 : isTablet ? 2 : 4);
  const [visibleCards, setVisibleCards] = useState(getVisibleCards());

  useEffect(() => {
    setVisibleCards(getVisibleCards());
  }, [isMobile, isTablet]);

  //Tp fetch specific sections
  const fetchSection = async (
    section: 'all' | 'popular' | 'airing' | 'upcoming',
    fetchFunction: (page: number) => Promise<any>
  ) => {
    setSectionLoading(prev => ({ ...prev, [section]: true }));
    try {
      const data = await fetchFunction(1);
      
      const validAnimeTypes = ['TV', 'Movie', 'OVA', 'ONA', 'Special'];
      
      const filterAnimeOnly = (data: Anime[]) => {
        return data.filter(item => validAnimeTypes.includes(item.type ?? ''));
      };
      
      const removeDuplicates = (array: Anime[]) => {
        const seen = new Set();
        return array.filter(item => {
          if (seen.has(item.mal_id)) return false;
          seen.add(item.mal_id);
          return true;
        });
      };
      
      setAnimeData(prev => ({
        ...prev,
        [section]: removeDuplicates(filterAnimeOnly(data.data)).slice(0, 20)
      }));
    } catch (error) {
      console.error(`Error fetching ${section} anime data:`, error);
      setError(`Failed to load ${section} anime. Please try again later.`);
    } finally {
      setSectionLoading(prev => ({ ...prev, [section]: false }));
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setError(null);
      await fetchSection('all', getAllAnime);
      await fetchSection('popular', getPopularAnime);
      await fetchSection('airing', getTopAiringAnime);
      await fetchSection('upcoming', getTopUpcomingAnime);
      
    };
    
    fetchAllData();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (text: string) => {
      if (text.trim().length > 0) {
        setIsSearching(true);
        try {
          const result = await searchAnime(text);
          setSearchResults(result.data || []);
          setShowDropdown(true);
        } catch (error) {
          console.error("Search error:", error);
          setError("Failed to search. Please try again.");
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 250),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearch(text);
    debouncedSearch(text);
  };

  const handleSelect = (anime: Anime) => {
    setSearch(anime.title || '');
    setSearchResults([]);
    setShowDropdown(false);
    navigate(`/anime/${anime.mal_id}`);
  };

  const handleSearch = () => {
    if (search.trim() && searchResults.length > 0) {
      handleSelect(searchResults[0]);
    } else if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleClickAway = () => {
    setShowDropdown(false);
  };

  const handleCarouselNav = (section: 'all' | 'airing' | 'popular' | 'upcoming', direction: 'next' | 'prev') => {
    const sectionData = animeData[section];
    const maxPosition = Math.max(0, sectionData.length - visibleCards);

    setCarouselPositions(prev => {
      let newPosition = prev[section] + (direction === 'next' ? 1 : -1);
      newPosition = Math.max(0, Math.min(newPosition, maxPosition));
      return { ...prev, [section]: newPosition };
    });
  };

  const handleRetry = (section: 'all' | 'airing' | 'popular' | 'upcoming') => {
    const fetchFunctions = {
      all: getAllAnime,
      popular: getPopularAnime,
      airing: getTopAiringAnime,
      upcoming: getTopUpcomingAnime
    };
    
    fetchSection(section, fetchFunctions[section]);
  };

  const renderSection = (title: string, section: 'all' | 'airing' | 'popular' | 'upcoming') => {
    const position = carouselPositions[section];
    const animeList = animeData[section];
    const isLoading = sectionLoading[section];
    const visibleAnime = animeList.slice(position, position + visibleCards);
    const hasNext = position + visibleCards < animeList.length;
    const hasPrev = position > 0;

    return (
      <Box sx={{ mt: 7, width: '100%', position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              color: 'primary.main',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -1,
                left: 0,
                width: '40%',
                height: '3px',
                backgroundColor: 'secondary.main',
                borderRadius: '2px'
              }
            }}
          >
            {title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isLoading ? (
              <CircularProgress size={24} color="secondary" />
            ) : animeList.length === 0 ? (
              <IconButton
                color="secondary"
                onClick={() => handleRetry(section)}
                title="Retry loading"
              >
                <Refresh />
              </IconButton>
            ) : null}
          </Box>
        </Box>

        <Box sx={{ position: 'relative', height: '440px' }}>
          {/* Back */}
          {hasPrev && (
            <Fade in={hasPrev}>
              <IconButton
                sx={{
                  position: 'absolute',
                  left: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
                }}
                onClick={() => handleCarouselNav(section, 'prev')}
                disabled={!hasPrev}
              >
                <ArrowBackIos />
              </IconButton>
            </Fade>
          )}

          {/* Container */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'flex-start', 
              gap: 7, 
              transition: 'all 0.5s ease',
              px: 5,
              py: 2,
              height: '100%',
              alignItems: 'center'
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <CircularProgress color="secondary" />
              </Box>
            ) : animeList.length === 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  Failed to load {section} anime. API rate limit might be exceeded.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  startIcon={<Refresh />}
                  onClick={() => handleRetry(section)}
                >
                  Retry
                </Button>
              </Box>
            ) : (
              visibleAnime.map((anime) => (
                <Fade in={true} key={anime.mal_id} timeout={500}>
                  <Box sx={{ width: '225px' }}>
                    <AnimeCard anime={anime} />
                  </Box>
                </Fade>
              ))
            )}
          </Box>

          {/* Next */}
          {hasNext && (
            <Fade in={hasNext}>
              <IconButton
                sx={{
                  position: 'absolute',
                  right: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
                }}
                onClick={() => handleCarouselNav(section, 'next')}
                disabled={!hasNext}
              >
                <ArrowForwardIos />
              </IconButton>
            </Fade>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', position: 'relative', overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: -1
        }}
      />

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Container maxWidth="lg" sx={{ py: 6, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 8, mt: 4 }}>
          <Typography variant="h2" component="h1" fontWeight="bold" sx={{ mb: 2, background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)', backgroundClip: 'text', textFillColor: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Discover Anime
          </Typography>

          <Typography variant="h6" sx={{ mb: 5, maxWidth: '600px', color: 'rgba(255,255,255,0.8)' }}>
            Explore the latest, most popular, and upcoming anime all in one place
          </Typography>

          <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{ position: 'relative', width: { xs: '100%', sm: '80%', md: '60%' } }}>
              <Paper elevation={3} sx={{ p: 0.5, display: 'flex', alignItems: 'center', width: '100%', borderRadius: '30px', backgroundColor: 'rgba(255,255,255,0.9)' }}>
                <TextField
                  placeholder="Search for anime..."
                  variant="standard"
                  fullWidth
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                    endAdornment: isSearching ? (
                      <InputAdornment position="end">
                        <CircularProgress size={20} color="inherit" />
                      </InputAdornment>
                    ) : null
                  }}
                  sx={{ ml: 2, flex: 1 }}
                  value={search}
                  onChange={handleChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </Paper>
              
              {/* Dropdown for search */}
              {showDropdown && searchResults.length > 0 && (
                <Paper 
                  elevation={5} 
                  sx={{ 
                    position: 'absolute', 
                    top: '100%', 
                    left: 0, 
                    right: 0, 
                    mt: 1, 
                    maxHeight: '400px', 
                    overflow: 'auto',
                    borderRadius: '10px',
                    zIndex: 100,
                    backgroundColor: 'rgba(255,255,255,0.95)'
                  }}
                >
                  <List sx={{ py: 0 }}>
                    {searchResults.slice(0, 8).map((anime) => (
                      <ListItem 
                        key={anime.mal_id} 
                        onClick={() => handleSelect(anime)}
                        sx={{ 
                          borderBottom: '1px solid rgba(0,0,0,0.08)',
                          '&:hover': { 
                            backgroundColor: 'rgba(0,0,0,0.04)',
                          },
                          '&:last-child': {
                            borderBottom: 'none',
                          },
                          cursor: 'pointer'
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            src={anime.images?.jpg?.image_url || ''} 
                            alt={anime.title}
                            variant="rounded"
                            sx={{ width: 50, height: 70, borderRadius: '4px' }}
                          />
                        </ListItemAvatar>
                        <ListItemText 
                          primary={anime.title} 
                          secondary={
                            <Typography 
                              variant="body2" 
                              component="span" 
                              sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}
                            >
                              <span>{anime.type || 'N/A'}</span>
                              {anime.season && (
                                <span>{anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} {anime.year}</span>
                              )}
                              {anime.score && (
                                <span>Score: {anime.score}</span>
                              )}
                            </Typography>
                          }
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                    ))}
                    {searchResults.length > 8 && (
                      <ListItem 
                        onClick={() => navigate(`/search?q=${encodeURIComponent(search)}`)}
                        sx={{ 
                          justifyContent: 'center', 
                          color: 'primary.main',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          '&:hover': { 
                            backgroundColor: 'rgba(0,0,0,0.04)',
                          },
                        }}
                      >
                      </ListItem>
                    )}
                  </List>
                </Paper>
              )}
              
              {/* No results message */}
              {showDropdown && search.trim() && searchResults.length === 0 && !isSearching && (
                <Paper 
                  elevation={5} 
                  sx={{ 
                    position: 'absolute', 
                    top: '100%', 
                    left: 0, 
                    right: 0, 
                    mt: 1, 
                    borderRadius: '10px',
                    zIndex: 100,
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    p: 2,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No results found for "{search}"
                  </Typography>
                </Paper>
              )}
            </Box>
          </ClickAwayListener>
        </Box>

        {renderSection('All Anime', 'all')}
        {renderSection('Top Airing Anime', 'airing')}
        {renderSection('Most Popular Anime', 'popular')}
        {renderSection('Upcoming Anime', 'upcoming')}
      </Container>
    </Box>
  );
};

export default HomePage;