import TranslateIcon from '@mui/icons-material/Translate';
import { useTranslation } from "react-i18next";

import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import Tooltip from '@mui/material/Tooltip';
import React from 'react';

export const LanguageSelector = ({color}) =>
{
    const [t, i18n] = useTranslation('translation');
    const [open, setOpen] = React.useState(false);

    const handleOpenChange = React.useCallback((event, isOpen) => {
      setOpen(isOpen);
    }, []);



    return <Dropdown open={open} onOpenChange={handleOpenChange}>
            <Tooltip title="Languages">
          <MenuButton

            variant="plain"
       
               size="sm"
               sx={{
                borderRadius: 40 ,
                 p: 1,
                 gap: 1,
                 "--ListItem-radius": "var(--joy-radius-sm)"
               }}

          >
            <TranslateIcon  style={{ color: color }} />
          </MenuButton>
        </Tooltip>
      
        <Menu placement="bottom-end"         sx={{
          zIndex: "99999",

        }}>
       
        
        <MenuItem onClick={() => {i18n.changeLanguage('en');handleOpenChange();}}>{t('Navbar.language-selector.en')}</MenuItem>
        <MenuItem onClick={() => {i18n.changeLanguage('fr');handleOpenChange();}}>{t('Navbar.language-selector.fr')}</MenuItem>

      </Menu>

          
       
    </Dropdown>
}

