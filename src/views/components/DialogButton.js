import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';

export default function BasicModalDialog() {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    serialNo: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("data",formData)
    try {
      // Assuming you have an API endpoint for adding a new sensor
    } catch (error) {
      console.error('Error adding sensor:', error.message);
    }

    setOpen(false);
  };
  const handleInnerFormSubmit = (event) => {
    // Prevent the event from propagating to the outer form
    event.stopPropagation();
    handleSubmit(event);
  }
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  return (
    <React.Fragment>
      <Button
        variant="soft"
        color="primary"
        startDecorator={<Add />}
        onClick={() => setOpen(true)}
        sx={{ marginBottom: 2, width: '50%',height:'56px' }}
      >
        New Sensor
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
        <DialogTitle>Create new sensor</DialogTitle>
          
          <form style={{padding:0,display: "initial"}}
            onSubmit={handleSubmit}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel >Name</FormLabel>
                <Input
                  autoFocus
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Sensor Serial Number</FormLabel>
                <Input
                  required
                  name="serialNo"
                  value={formData.serialNo}
                  onChange={handleChange}
                />
              </FormControl>
              <Button type="submit"  onClick={handleInnerFormSubmit}>Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}