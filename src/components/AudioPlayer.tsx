import { FC } from 'react';
import Box from '@mui/material/Box';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: FC<AudioPlayerProps> = ({ src }) => {
    console.log("src", src)
  return (
    <Box
      sx={{
        mt: 2,
        backgroundColor: 'grey.900',
        p: 1,
        borderRadius: 1,
        width: '100%',
        alignSelf: 'center'
      }}
    >
      <audio controls style={{ width: '100%' }} data-testid="audio-player">
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </Box>
  );
};

export default AudioPlayer;
