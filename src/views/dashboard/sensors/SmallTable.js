import React from 'react';

import Box from '@mui/joy/Box';

import Typography from '@mui/joy/Typography';

import Sheet from '@mui/joy/Sheet';

import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';

import TextSnippetIcon from '@mui/icons-material/TextSnippet';

function SmallTable() {
  return (
    <Sheet
    variant="outlined"
    sx={{
      display: { xs: 'inherit', sm: 'none' },
      borderRadius: 'sm',
      overflow: 'auto',
      backgroundColor: 'background.surface',
      '& > *': {
        '&:nth-child(n):not(:nth-last-child(-n+4))': {
          borderBottom: '1px solid',
          borderColor: 'divider',
        },
      },
    }}
  >
    <List size="sm" aria-labelledby="table-in-list">
      <ListItem>
        <ListItemButton variant="soft" sx={{ bgcolor: 'transparent' }}>
          <ListItemContent sx={{ p: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                level="title-sm"
                startDecorator={<TextSnippetIcon color="primary" />}
                sx={{ alignItems: 'flex-start' }}
              >
                Travel pictures
              </Typography>
              <Typography level="body-sm">John Smith</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 2,
              }}
            >
              <Typography level="body-sm">987.5MB</Typography>

              <Typography level="body-sm">21 Oct 2023, 3PM</Typography>
            </Box>
          </ListItemContent>
        </ListItemButton>
      </ListItem>
      <ListDivider />
      <ListItem>
        <ListItemButton variant="soft" sx={{ bgcolor: 'transparent' }}>
          <ListItemContent sx={{ p: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                level="title-sm"
                startDecorator={<TextSnippetIcon color="primary" />}
                sx={{ alignItems: 'flex-start' }}
              >
                Important documents
              </Typography>
              <Typography level="body-sm">halim Elleuch</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 2,
              }}
            >
              <Typography level="body-sm">232.3MB</Typography>

              <Typography level="body-sm">26 Sep 2023, 7PM</Typography>
            </Box>
          </ListItemContent>
        </ListItemButton>
      </ListItem>
      <ListDivider />
      <ListItem>
        <ListItemButton variant="soft" sx={{ bgcolor: 'transparent' }}>
          <ListItemContent sx={{ p: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                level="title-sm"
                startDecorator={<TextSnippetIcon color="primary" />}
                sx={{ alignItems: 'flex-start' }}
              >
                Projects
              </Typography>
              <Typography level="body-sm">Mohamed Elleuch</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 2,
              }}
            >
              <Typography level="body-sm">1.6GB</Typography>

              <Typography level="body-sm">12 Aug 2021, 7PM</Typography>
            </Box>
          </ListItemContent>
        </ListItemButton>
      </ListItem>
      <ListDivider />
      <ListItem>
        <ListItemButton variant="soft" sx={{ bgcolor: 'transparent' }}>
          <ListItemContent sx={{ p: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Typography
                level="title-sm"
                startDecorator={<TextSnippetIcon color="primary" />}
                sx={{ alignItems: 'flex-start' }}
              >
                Invoices
              </Typography>
              <Typography level="body-sm">cave 123</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 2,
              }}
            >
              <Typography level="body-sm">123.3KB</Typography>

              <Typography level="body-sm">14 Mar 2021, 7PM</Typography>
            </Box>
          </ListItemContent>
        </ListItemButton>
      </ListItem>
    </List>
  </Sheet>
  )
}

export default SmallTable