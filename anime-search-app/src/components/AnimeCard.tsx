import { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  Stack,
  Skeleton
} from '@mui/material';
import { Star, CalendarToday} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import type { Anime } from '../components/animeInterface';

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Box
      sx={{
        width: '225px',
        height: '460px',
        position: 'relative',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
        },
      }}
    >
      {/* Image container*/}
      <Box sx={{ height: '300px', position: 'relative', borderRadius: '0px', overflow: 'hidden' }}>
        {!imageLoaded && (
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height="100%" 
            animation="wave" 
          />
        )}
        <CardMedia
          component="img"
          image={anime.images.jpg.image_url}
          alt={anime.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: imageLoaded ? 'block' : 'none'
          }}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Score badge - always show something */}
        <Chip
          label={anime.score ? anime.score.toFixed(1) : 'N/A'}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            fontWeight: 'bold',
            backgroundColor: !anime.score ? '#9e9e9e' :
                            anime.score >= 8 ? '#4caf50' : 
                            anime.score >= 6 ? '#ff9800' : 
                            '#f44336',
            color: 'white'
          }}
          icon={<Star sx={{ color: 'white !important', fontSize: '16px' }} />}
        />
      </Box>

      {/* Content Card */}
      <Card
        component={Link}
        to={`/anime/${anime.mal_id}`}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '160px',
          backgroundColor: 'white',
          textDecoration: 'none',
          borderRadius: '0px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.3s',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Typography 
            variant="subtitle1" 
            fontWeight="bold"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              height: '48px', // Fixed height for 2 lines of text
              mb: 1
            }}
            title={anime.title}
          >
            {anime.title}
          </Typography>

          {/* Info row */}
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <CalendarToday sx={{ fontSize: '14px', color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {anime.year || (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 'Unknown')}
            </Typography>
            
            <Box sx={{ height: '14px', width: '1px', backgroundColor: 'divider', mx: 0.5 }} />
            
            <Typography variant="body2" color="text.secondary">
              {anime.type || 'N/A'} {anime.episodes ? `• ${anime.episodes} ep` : ''}
            </Typography>
          </Stack>

          {/* Status indicator */}
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              sx={{
                display: 'inline-block',
                px: 1,
                py: 0.25,
                borderRadius: '4px',
                backgroundColor: anime.status?.includes('Airing') ? 'rgba(76, 175, 80, 0.1)' :
                                anime.status?.includes('Not yet aired') ? 'rgba(33, 150, 243, 0.1)' :
                                'rgba(158, 158, 158, 0.1)',
                color: anime.status?.includes('Airing') ? '#1b5e20' :
                      anime.status?.includes('Not yet aired') ? '#0d47a1' :
                      '#424242',
                fontWeight: 'medium'
              }}
            >
              {anime.status || 'Unknown'}
            </Typography>
          </Box>

          {/* Genres */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {anime.genres?.slice(0, 2).map((genre) => (
              <Chip
                key={genre.mal_id}
                label={genre.name}
                size="small"
                sx={{
                  height: '20px',
                  '& .MuiChip-label': {
                    px: 1,
                    fontSize: '0.7rem'
                  },
                  backgroundColor: 'rgba(0,0,0,0.05)'
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AnimeCard;