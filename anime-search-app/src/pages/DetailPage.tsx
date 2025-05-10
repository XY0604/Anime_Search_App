import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  getAnimeById,
  getAnimeCharacters,
  getAnimeEpisodes,
  getAnimeReviews
} from '../api/jikanAPI';
import type { Anime, Character, Episode } from '../components/animeInterface';

// MUI Components
import {
  Typography,
  Box,
  Container,
  Paper,
  Grid,
  Button,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Divider,
  Stack,
  IconButton,
  Rating,
  useTheme,
  useMediaQuery,
  Skeleton,
  Tooltip,
  LinearProgress,
  Badge,
  Breadcrumbs
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// MUI Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 350,
  overflow: 'hidden',
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('md')]: {
    height: 250,
  },
}));

const HeroBackdrop = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'blur(3px)',
  transform: 'scale(1.05)',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(to bottom, ${alpha(theme.palette.common.black, 0.7)}, ${alpha(theme.palette.common.black, 0.85)})`,
  }
}));

const PosterCard = styled(Card)(({ theme }) => ({
  width: 200,
  height: 300,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[8],
  overflow: 'hidden',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('md')]: {
    width: 150,
    height: 225,
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  height: '100%',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[4],
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  marginBottom: theme.spacing(3),
  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
}));

const RatingChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 'bold',
  padding: theme.spacing(0.5, 1),
}));

const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const CharacterCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  height: '100%',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[6],
  }
}));

const AnimeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [expandedSynopsis, setExpandedSynopsis] = useState<boolean>(false);

  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Fetch information
        const animeData = await getAnimeById(parseInt(id));
        setAnime(animeData.data);

        // Fetch characters
        const charactersData = await getAnimeCharacters(parseInt(id));
        setCharacters(charactersData.data);

        // Fetch episodes
        const episodesData = await getAnimeEpisodes(parseInt(id));
        setEpisodes(episodesData.data);

        // Fetch reviews
        const reviewsData = await getAnimeReviews(parseInt(id));
        setReviews(reviewsData.data);

        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Error fetching anime details:', err);
        setError('Failed to load anime details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const toggleExpandSynopsis = () => {
    setExpandedSynopsis(!expandedSynopsis);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton width={100} height={40} />
        </Box>

        <HeroSection>
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </HeroSection>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" width="80%" />
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="rectangular" height={40} width={120} sx={{ mb: 2 }} />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </Box>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
          <Box mt={2}>
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              color="primary"
            >
              Return to Home
            </Button>
          </Box>
        </Alert>
      </Box>
    );
  }

  if (!anime) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="warning" sx={{ maxWidth: 500 }}>
          <AlertTitle>Anime Not Found</AlertTitle>
          The anime you're looking for couldn't be found.
          <Box mt={2}>
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              color="primary"
            >
              Return to Home
            </Button>
          </Box>
        </Alert>
      </Box>
    );
  }

  // Renderer for different tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Overview
        return (
          <TabPanel>
            <Typography variant="h6" gutterBottom>
              <strong>Synopsis</strong>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                overflow: expandedSynopsis ? 'visible' : 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: expandedSynopsis ? 'none' : 4,
                WebkitBoxOrient: 'vertical',
                mb: 1
              }}
            >
              {anime.synopsis || 'No synopsis available.'}
            </Typography>

            {anime.synopsis && anime.synopsis.length > 300 && (
              <Button
                endIcon={expandedSynopsis ? undefined : <ExpandMoreIcon />}
                onClick={toggleExpandSynopsis}
                size="small"
                sx={{ mb: 3 }}
              >
                {expandedSynopsis ? 'Show Less' : 'Read More'}
              </Button>
            )}

            {anime.background && (
              <Box sx={{ mt: 4, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <strong>Background</strong>
                </Typography>
                <Typography variant="body1">
                  {anime.background}
                </Typography>
              </Box>
            )}

            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'medium', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}>Type:</TableCell>
                            <TableCell sx={{ borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}>{anime.type || 'Unknown'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'medium', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}>Episodes:</TableCell>
                            <TableCell sx={{ borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}>{anime.episodes || 'Unknown'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'medium', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}>Status:</TableCell>
                            <TableCell sx={{ borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}>{anime.status || 'Unknown'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'medium', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}>Aired:</TableCell>
                            <TableCell sx={{ borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}>
                              {anime.aired ?
                                `${formatDate(anime.aired.from)} to ${anime.aired.to ? formatDate(anime.aired.to) : 'Present'}`
                                : 'Unknown'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'medium', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}>Season:</TableCell>
                            <TableCell sx={{ borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}>
                              {anime.season ?
                                `${anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} ${anime.year}`
                                : 'Unknown'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'medium', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}>Source:</TableCell>
                            <TableCell sx={{ borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}>{anime.source || 'Unknown'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'medium', borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}>Duration:</TableCell>
                            <TableCell sx={{ borderBottom: '1px solid rgba(224, 224, 224, 0.3)' }}>{anime.duration || 'Unknown'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>Rating:</TableCell>
                            <TableCell>{anime.rating || 'Unknown'}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Statistics
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <StatsCard>
                          <Typography variant="overline" color="text.secondary">Score</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h4" component="span" color="primary.main">
                              {anime.score || 'N/A'}
                            </Typography>
                            <Typography variant="body2" sx={{ ml: 1 }} color="text.secondary">
                              / 10
                            </Typography>
                          </Box>
                          {anime.scored_by && (
                            <Typography variant="caption" color="text.secondary">
                              Based on {anime.scored_by.toLocaleString()} ratings
                            </Typography>
                          )}
                        </StatsCard>
                      </Grid>

                      <Grid item xs={6}>
                        <StatsCard>
                          <Typography variant="overline" color="text.secondary">Ranked</Typography>
                          <Typography variant="h4" component="span" color="secondary.main">
                            #{anime.rank || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Popularity: #{anime.popularity || 'N/A'}
                          </Typography>
                        </StatsCard>
                      </Grid>

                      <Grid item xs={6}>
                        <StatsCard>
                          <Typography variant="overline" color="text.secondary">Members</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PeopleIcon color="info" sx={{ mr: 1 }} />
                            <Typography variant="h6">
                              {anime.members ? (
                                anime.members > 1000000
                                  ? `${(anime.members / 1000000).toFixed(1)}M`
                                  : `${(anime.members / 1000).toFixed(0)}K`
                              ) : 'N/A'}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={anime.members ? Math.min(anime.members / 100000, 100) : 0}
                            sx={{ mt: 1, mb: 1 }}
                          />
                        </StatsCard>
                      </Grid>

                      <Grid item xs={6}>
                        <StatsCard>
                          <Typography variant="overline" color="text.secondary">Favorites</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FavoriteIcon color="error" sx={{ mr: 1 }} />
                            <Typography variant="h6">
                              {anime.favorites ? (
                                anime.favorites > 1000000
                                  ? `${(anime.favorites / 1000000).toFixed(1)}M`
                                  : `${(anime.favorites / 1000).toFixed(0)}K`
                              ) : 'N/A'}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            color="error"
                            value={anime.favorites ? Math.min(anime.favorites / 10000, 100) : 0}
                            sx={{ mt: 1, mb: 1 }}
                          />
                        </StatsCard>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                <strong>Genres</strong>
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {anime.genres && anime.genres.length > 0 ? (
                  anime.genres.map(genre => (
                    <Chip
                      key={genre.mal_id}
                      label={genre.name}
                      color="primary"
                      variant="filled"
                      sx={{
                        borderRadius: '16px',
                        fontWeight: 500,
                        '&:hover': {
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.2s'
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No genres listed</Typography>
                )}
              </Stack>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                <strong>Studios</strong>
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {anime.studios && anime.studios.length > 0 ? (
                  anime.studios.map(studio => (
                    <Chip
                      key={studio.mal_id}
                      label={studio.name}
                      color="secondary"
                      variant="outlined"
                      sx={{
                        borderRadius: '16px',
                        fontWeight: 500,
                        '&:hover': {
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.2s'
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No studios listed</Typography>
                )}
              </Stack>
            </Box>
          </TabPanel>
        );

      case 1: // Characters
        return (
          <TabPanel>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              <strong>Characters & Voice Actors</strong>
            </Typography>
            {characters.length > 0 ? (
              <Grid container spacing={2}>
                {characters.slice(0, 12).map((char) => {
                  // Filter for Japanese voice actor
                  const japaneseVA = char.voice_actors?.find(va => va.language === 'Japanese');
                  

                  return (
                    <Grid item xs={12} sm={6} md={4} key={char.character.mal_id}>
                      <CharacterCard variant="outlined">
                        <Box sx={{ width: 100, minWidth: 100 }}>
                          <CardMedia
                            component="img"
                            sx={{
                              height: 150,
                              width: 100,
                              objectFit: 'cover',
                            }}
                            image={char.character.images?.jpg?.image_url || '/placeholder-character.jpg'}
                            alt={char.character.name}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, maxWidth: 170, minWidth: 170 }}>
                          <CardContent sx={{ flex: '1 0 auto', py: 1 }}>
                            <Typography variant="subtitle1" color="primary" fontWeight="bold">
                              {char.character.name}
                            </Typography>
                            <Chip
                              label={char.role || 'Unknown role'}
                              size="small"
                              color={char.role === 'Main' ? 'primary' : 'default'}
                              variant="outlined"
                              sx={{ mt: 0.5, mb: 1 }}
                            />
                            {japaneseVA ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Avatar
                                  src={japaneseVA.person.images?.jpg?.image_url || '/placeholder-va.jpg'}
                                  alt={japaneseVA.person.name}
                                  sx={{ width: 32, height: 32, mr: 1 }}
                                />
                                <Box>
                                  <Typography variant="caption" display="block">
                                    {japaneseVA.person.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Japanese VA
                                  </Typography>
                                </Box>
                              </Box>
                            ) : (
                              <Typography variant="caption" color="text.secondary">
                                No Japanese VA available
                              </Typography>
                            )}
                          </CardContent>
                        </Box>
                      </CharacterCard>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Typography color="text.secondary">No character information available</Typography>
            )}
            {characters.length > 12 && (
              <Box textAlign="center" mt={4}>
                <Button
                  variant="outlined"
                  color="primary"
                  endIcon={<OpenInNewIcon />}
                  href={`https://myanimelist.net/anime/${anime.mal_id}/characters`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View all characters on MyAnimeList
                </Button>
              </Box>
            )}
          </TabPanel>
        );

      case 2: // Episodes
        return (
          <TabPanel>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                <strong>Episodes</strong>
              </Typography>
            </Box>

            {episodes.length > 0 ? (
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Aired</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {episodes.map((episode) => (
                      <TableRow
                        key={episode.mal_id}
                        sx={{
                          backgroundColor: episode.filler ? alpha(theme.palette.warning.light, 0.2) :
                            episode.recap ? alpha(theme.palette.action.hover, 0.5) :
                              'inherit',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.light, 0.1)
                          },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PlayCircleOutlineIcon color="action" sx={{ mr: 1, opacity: 0.7 }} />
                            <Typography variant="body2">
                              {episode.title}
                            </Typography>
                            {episode.filler && (
                              <Chip
                                label="Filler"
                                size="small"
                                color="warning"
                                variant="outlined"
                                sx={{ ml: 1 }}
                              />
                            )}
                            {episode.recap && (
                              <Chip
                                label="Recap"
                                size="small"
                                color="default"
                                variant="outlined"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.5 }} />
                            <Typography variant="body2">
                              {episode.aired ? formatDate(episode.aired) : 'Unknown'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                <AlertTitle>No Episodes Available</AlertTitle>
                Episode information hasn't been added yet for this anime.
              </Alert>
            )}
          </TabPanel>
        );
      case 3: // Reviews
        return (
          <TabPanel>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              <strong>User Reviews</strong>
            </Typography>

            {reviews.length > 0 ? (
              <Box>
                {reviews.slice(0, 5).map((review) => (
                  <Paper
                    key={review.mal_id}
                    variant="outlined"
                    sx={{
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      transition: 'box-shadow 0.2s',
                      '&:hover': {
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                      <Avatar
                        src={review.user.images?.jpg?.image_url || ''}
                        alt={review.user.username}
                        sx={{ mr: 2 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {review.user.username}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating
                              value={review.score / 2}
                              precision={0.5}
                              size="small"
                              readOnly
                            />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {review.score}/10
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                          {review.episodes_watched && ` • Watched ${review.episodes_watched} episodes`}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {review.review}
                      </Typography>

                      <Button
                        size="small"
                        sx={{ mt: 1 }}
                        href={review.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        endIcon={<OpenInNewIcon />}
                      >
                        Read Full Review
                      </Button>
                    </Box>
                  </Paper>
                ))}

                <Box textAlign="center" mt={4}>
                  <Button
                    variant="outlined"
                    color="primary"
                    endIcon={<OpenInNewIcon />}
                    href={`https://myanimelist.net/anime/${anime.mal_id}/reviews`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View all reviews on MyAnimeList
                  </Button>
                </Box>
              </Box>
            ) : (
              <Alert severity="info">
                <AlertTitle>No Reviews</AlertTitle>
                No user reviews available for this anime.
              </Alert>
            )}
          </TabPanel>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} to="/" underline="hover" color="inherit">
            Home
          </Link>
          <Link component={RouterLink} to="/anime" underline="hover" color="inherit">
            Anime
          </Link>
          <Typography color="text.primary" noWrap>
            {anime.title}
          </Typography>
        </Breadcrumbs>
      </Box>

      <HeroSection>
        <HeroBackdrop
          sx={{
            backgroundImage: `url(${anime.images?.jpg?.large_image_url || anime.images?.webp?.large_image_url})`,
          }}
        />
        <Container>
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              height: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              py: 3,
              px: { xs: 2, md: 3 }
            }}
          >
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item>
                <PosterCard>
                  <CardMedia
                    component="img"
                    image={anime.images?.jpg?.large_image_url || anime.images?.webp?.large_image_url || '/placeholder.jpg'}
                    alt={anime.title}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </PosterCard>
              </Grid>
              <Grid item xs>
                <Box>
                  {anime.title_english && anime.title_english !== anime.title && (
                    <Typography variant="h6" color="primary.light" gutterBottom>
                      {anime.title_english}
                    </Typography>
                  )}
                  <Typography variant="h4" component="h1" color="common.white" gutterBottom fontWeight="bold">
                    {anime.title}
                  </Typography>

                  {anime.title && (
                    <Typography variant="subtitle1" color="common.white" sx={{ opacity: 0.8 }} gutterBottom>
                      {anime.title}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {anime.score && (
                      <RatingChip
                        icon={<StarIcon />}
                        label={`${anime.score} / 10`}
                      />
                    )}

                    {anime.year && (
                      <Chip
                        icon={<CalendarTodayIcon />}
                        label={anime.year}
                        sx={{ backgroundColor: alpha(theme.palette.common.white, 0.2), color: 'white' }}
                      />
                    )}

                    {anime.type && (
                      <Chip
                        label={anime.type}
                        sx={{ backgroundColor: alpha(theme.palette.common.white, 0.2), color: 'white' }}
                      />
                    )}

                    {anime.status && (
                      <Chip
                        label={anime.status}
                        sx={{
                          backgroundColor:
                            anime.status.includes('Currently') ? alpha(theme.palette.success.main, 0.8) :
                              anime.status.includes('Finished') ? alpha(theme.palette.info.main, 0.8) :
                                alpha(theme.palette.warning.main, 0.8),
                          color: 'white'
                        }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', mt: 3, gap: 1 }}>
                    {anime.trailer?.youtube_id && (
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<YouTubeIcon />}
                        href={`https://www.youtube.com/watch?v=${anime.trailer.youtube_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Watch Trailer
                      </Button>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </HeroSection>

      <StyledPaper>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMedium ? "scrollable" : "fullWidth"}
          scrollButtons={isMedium ? "auto" : false}
          allowScrollButtonsMobile
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: alpha(theme.palette.background.paper, 0.8)
          }}
        >
          <Tab label="Overview" />
          <Tab label="Characters" />
          <Tab label="Episodes" />
          <Tab label="Reviews" />
        </Tabs>

        {renderTabContent()}
      </StyledPaper>
    </Container>
  );
};

export default AnimeDetailPage;