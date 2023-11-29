import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';

import Typography from '@mui/joy/Typography';

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';



import FileTable from './Components/FileTable.tsx';
import FileList from './Components/FileList.tsx';
import { useTranslation } from 'react-i18next';


const useEnhancedEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export default function ObservationFiles() {

  const {t} = useTranslation("translation");

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '90dvh' }}>
        

        <Box
          component="main"
          className="MainContent"
          sx={{
            px: {
              xs: 2,
              md: 6,
            },            pt: {
              xs: "calc(12px + var(--Header-height))",
              sm: "calc(12px + var(--Header-height))",
              md: 2
            },
           
            
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '90dvh',
            gap: 1,
          }}
        >

          <Box
            sx={{
              display: 'flex',
              my: 1,
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'start', sm: 'center' },
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <Typography level="h2">{t('Obs.title')}</Typography>
            <Button
              color="primary"
              startDecorator={<DownloadRoundedIcon />}
              size="sm"
            >
              {t('Obs.download')}
            </Button>
          </Box>
          <FileTable />
          <FileList />
        </Box>
      </Box>
    </CssVarsProvider>
  );
}