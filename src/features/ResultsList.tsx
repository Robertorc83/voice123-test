'use client'

import { FC } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import Highlight from '../components/Highlight';
import AudioPlayer from '../components/AudioPlayer';
import { Provider } from '../hooks/useFetchProviders';

interface ResultsListProps {
  providers: Provider[];
  query: string;
}

const fallbackImage = '/user-fallback.webp';

// Use fixed URL for the audio sample becasue other samples need auth
const fixedAudioUrl = encodeURI("https://sandbox.voice123.com/samples/luis -  lalaa lalala la.mp3");

const truncateText = (text: string, maxLength: number = 100): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const ResultsList: FC<ResultsListProps> = ({ providers, query }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 8, md: 12 }}>
        {providers.map((provider) => {
          const imageSrc =
            provider.user.picture_small ||
            provider.user.picture_medium ||
            provider.user.picture_large ||
            fallbackImage;

          const audioSrc = fixedAudioUrl;

          const hasExtraContent = provider.description || provider.additional_details;

          return (
            <Grid2
              key={provider.id}
              size={{ xs: 2, sm: 4, md: 4 }}
              sx={{ display: 'flex' }}
            >
              <Card
                sx={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: 'grey.100',
                }}
              >
                {/* Header */}
                <CardHeader
                  title={
                    <NextLink href={`https://voice123.com/${provider.user.username}`} passHref legacyBehavior>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ display: 'block', padding: '8px' }}
                      >
                        <Typography
                          variant="h6"
                          noWrap
                          title={provider.user.name}
                          sx={{
                            fontWeight: 'bold',
                            color: 'white',
                            textAlign: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            padding: '8px 0',
                          }}
                        >
                          {provider.user.name}
                        </Typography>
                      </Link>
                    </NextLink>
                  }
                  subheader={
                    <Typography
                      variant="subtitle1"
                      noWrap
                      title={provider.headline || ""}
                      sx={{
                        color: 'white',
                        textAlign: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        padding: '4px 0',
                      }}
                    >
                      {provider.headline}
                    </Typography>
                  }
                  sx={{
                    backgroundColor: 'black',
                    padding: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '80px',
                  }}
                />

                {/* Profile Image */}
                <CardMedia sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                  <Image
                    src={imageSrc}
                    alt={`${provider.user.name} profile`}
                    width={100}
                    height={100}
                    style={{ borderRadius: '50%' }}
                  />
                </CardMedia>

                {/* Description / Fallback Content */}
                {hasExtraContent ? (
                  <CardContent
                    sx={{
                      minHeight: 80,
                      color: 'black',
                      overflow: 'hidden',
                    }}
                  >
                    {provider.description && (
                      <Typography
                        variant="body1"
                        sx={{ mt: 1 }}
                        title={provider.description}
                      >
                        <Highlight text={truncateText(provider.description, 100)} query={query} />
                      </Typography>
                    )}
                    {provider.additional_details && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          fontStyle: 'italic',
                          opacity: 0.8,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={provider.additional_details}
                      >
                        {truncateText(provider.additional_details, 100)}
                      </Typography>
                    )}
                  </CardContent>
                ) : (
                  <CardContent
                    sx={{
                      minHeight: 80,
                      color: 'black',
                      overflow: 'hidden',
                    }}
                  >
                    {provider.user.location && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={provider.user.location}
                      >
                        <strong>Location:</strong> {provider.user.location}
                      </Typography>
                    )}
                    {provider.relevant_sample && provider.relevant_sample.name && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={provider.relevant_sample.name}
                      >
                        <strong>Sample:</strong> {provider.relevant_sample.name}
                      </Typography>
                    )}
                  </CardContent>
                )}

                {/* Audio Player */}
                <CardActions sx={{ padding: 2 }}>
                  <AudioPlayer src={audioSrc} />
                </CardActions>
              </Card>
            </Grid2>
          );
        })}
      </Grid2>
    </Box>
  );
};

export default ResultsList;
