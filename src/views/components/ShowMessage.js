import React, { useEffect } from 'react'


import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';



function ShowMessage({openvalue,message,status}) {
   
   
    const [state, setState] = React.useState({open: openvalue,vertical: 'top',horizontal: 'center',});
    const { vertical, horizontal, open } = state;

    const handleClose = () => {
      setState({ ...state, open: false });
    };


  useEffect(()=>{
    setState({ ...state, open: openvalue });
  },[openvalue]);



  return (
     <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} onClose={handleClose} message={message} key={vertical + horizontal} >
        <Alert onClose={handleClose} severity={status} sx={{ width: '100%' }}>{message}
                </Alert></Snackbar>
  )
}

export default ShowMessage