import { Box } from '@mui/material'
import React from 'react'
import {useTranslation} from "react-i18next";

function Home() {
  const {t} = useTranslation("translation");

  return (
    <Box       sx={{height: '92vh', backgroundColor: '#eee' }}  >
      {t('Home.title')}
      </Box>
  )
}

export default Home