import {useTranslation} from "react-i18next";
import TranslateIcon from '@mui/icons-material/Translate';
import { Box, IconButton, Menu, MenuItem } from "@mui/material"; 
import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';

export const LanguageSelector = ({color}) =>
{
    const [t, i18n] = useTranslation('translation');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleLanguageMenuClose = () => {
        setAnchorEl(null);
      };
      const handleLanguageMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
      };

    return <Box>
            <Tooltip title="Languages">
          <IconButton
            onClick={handleLanguageMenuOpen}
            size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <TranslateIcon  style={{ color: color }} />
          </IconButton>
        </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleLanguageMenuClose}
        onClick={handleLanguageMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
       
        
        <MenuItem onClick={() => {i18n.changeLanguage('en');handleLanguageMenuClose()}}>{t('Navbar.language-selector.en')}</MenuItem>
        <MenuItem onClick={() => {i18n.changeLanguage('fr');handleLanguageMenuClose()}}>{t('Navbar.language-selector.fr')}</MenuItem>

      </Menu>

          
       
    </Box>
}

