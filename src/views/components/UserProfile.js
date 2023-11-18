import React, { useEffect, useState } from 'react';
import {Container,Breadcrumbs,Typography,Card,CardContent,CardMedia,Button,List,ListItem,ListItemText,Divider,Grid,LinearProgress,Box,Icon,Avatar} from '@mui/material';
import { fetchUserInfo } from '../../apis/UserController';
import dateFormat from 'dateformat';
import ListItemButton from '@mui/material/ListItemButton';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import ListItemDecorator, {
  listItemDecoratorClasses,
} from '@mui/joy/ListItemDecorator';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('1', 'Reefnet sensor', 'Feb 3, 2023', 'Reefnet_13-05-2020_20-01-2022_villebruc'),
  createData('2', 'Reefnet sensor', 'Feb 3, 2023', 'Reefnet_13-05-2020_20-01-2022_villebruc'),
  createData('3', 'Reefnet sensor', 'Feb 3, 2023', 'Reefnet_13-05-2020_20-01-2022_villebruc'),
  createData('4', 'Reefnet sensor', 'Feb 3, 2023', 'Reefnet_13-05-2020_20-01-2022_villebruc'),
  createData('5', 'Reefnet sensor', 'Feb 3, 2023', 'Reefnet_13-05-2020_20-01-2022_villebruc'),
  createData('6', 'Reefnet sensor', 'Feb 3, 2023', 'Reefnet_13-05-2020_20-01-2022_villebruc'),

];


export default function UserProfile() {
  const [index, setIndex] = React.useState(0);
  const [user, setUser] = useState({firstName:'',lastName:'',email:'',license:'',createdAt:''});

  useEffect(() => {

    const fetchData = async () => {
      try {
        const userdata = await fetchUserInfo();
        setUser({...userdata,address:'Bay Area, San Francisco, CA',phone:'(098) 765-4321'});
        
      } catch (error) {
        console.error('Error fetching sensor types:', error);
        // Handle errors as needed
      }
    };

    fetchData();
    console.log("user page: ",user);
    

  }, [user.createdAt]);

  const handleButtonClick = () => {
    // Handle button click logic here
  };
  return (
    <Box  sx={{ backgroundColor: '#eee' }}>
      <Container sx={{ py: 3.7 }}>


        <Grid container spacing={3} >
          <Grid  item lg={4}  justifyContent="center" alignItems="center">
          <Card sx={{ pt: 4 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar   alt="Johnatan Smith" src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" sx={{ width: 150, height:150 }}/>
            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
              <Typography variant="body1" color="textSecondary" paragraph>
                {user.role}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
              {dateFormat(user.createdAt, "dddd, mmmm dS, yyyy")} 
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px',marginTop:'4px' }}>
                <Button variant="contained">Add</Button>
                <Button variant="contained" color="success" style={{ marginLeft: '8px' }}>Edit</Button>
                <Button variant="outlined" color="error" style={{ marginLeft: '8px' }}>Delete</Button>
              </div>
            </CardContent>
          </Card>
<br />
            <Card >
              <CardContent sx={{ padding: 0 ,pt:2,maxHeight:'250px'}}>
              <nav aria-label="secondary mailbox folders">
                <List aria-label="Sidebar"
                    sx={{
                      '--ListItem-paddingLeft': '0px',
                      '--ListItemDecorator-size': '64px',
                      '--ListItem-minHeight': '32px',
                      '--List-nestedInsetStart': '13px',
                      [`& .${listItemDecoratorClasses.root}`]: {
                        justifyContent: 'flex-end',
                        pr: '18px',
                      },
                      '& [role="button"]': {
                        borderRadius: '0 20px 20px 0',
                      },
                      padding: 0
                    }}
                    className="rounded-3">
                  {[
                    {text: 'Villebruc cave' },
                    { text: 'Beget Cave' },
                    {  text: 'Saint-Joseph cave', color: '#55acee' },
                  ].map((item, indexdata) => (
                    <React.Fragment key={indexdata} >
                    <ListItem disablePadding>
                    <ListItemButton
                    
               selected={index === indexdata}
               color={index === indexdata ? 'neutral' : undefined}
               onClick={() => {setIndex(indexdata);console.log(index)}}
              
              component="a"
              href="#simple-list"
              className="d-flex justify-content-between align-items-center p-3"
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
                      </ListItem>
                      
                      {indexdata !== 2 && <Divider />}
                     
                    </React.Fragment>
                  ))}
                </List>
                </nav>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item lg={8}>
            <Card className="mb-4">
              <CardContent>
                <Grid container>
                  {[
                    
                    { label: 'Full Name', value: `${user.firstName} ${user.lastName}` },
                    { label: 'License Number', value: user.license },
                    { label: 'Email', value: user.email },
                    { label: 'Phone', value: '(097) 234-5678' },
                    { label: 'Address', value: 'Bay Area, San Francisco, CA' },
                  ].map((item, index) => (
                    <React.Fragment key={index}>
                      <Grid item sm={3}>
                        <Typography>{item.label}</Typography>
                        
                      </Grid>
                      <Grid item sm={9} >
                      
                        <Typography className="text-muted">{item.value}</Typography>
                        
                      </Grid>
                      {index < 4 && (
            <Grid item xs={12} >
                <br />
              <Divider />
              <br />
            </Grid>
          )}
                      
                    </React.Fragment>
                  ))}
                 
                </Grid>
              </CardContent>
            </Card>
            <br />
            <Grid container spacing={3} >
              {[...Array(1)].map((_, index) => (
                <Grid item md={12} key={index} >
                  <Card className="mb-4" sx={{height:'250px'}}>
                    <CardContent sx={{padding:0,paddingLeft:1}}>
                    <Sheet
                        sx={{
                          '--TableCell-height': '40px',
                          // the number is the amount of the header rows.
                          '--TableHeader-height': 'calc(1 * var(--TableCell-height))',
                          height: 250,
                          overflow: 'auto',
                          background: (theme) =>
                            `linear-gradient(${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
                            linear-gradient(rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
                            radial-gradient(
                              farthest-side at 50% 0,
                              rgba(0, 0, 0, 0.12),
                              rgba(0, 0, 0, 0)
                            ),
                            radial-gradient(
                                farthest-side at 50% 100%,
                                rgba(0, 0, 0, 0.12),
                                rgba(0, 0, 0, 0)
                              )
                              0 100%`,
                          backgroundSize: '100% 40px, 100% 40px, 100% 14px, 100% 14px',
                          backgroundRepeat: 'no-repeat',
                          backgroundAttachment: 'local, local, scroll, scroll',
                          backgroundPosition:
                            '0 var(--TableHeader-height), 0 100%, 0 var(--TableHeader-height), 0 100%',
                          backgroundColor: 'background.surface',
                        }}
                      >
                        <Table stickyHeader>
                          <thead>
                            <tr>
                              <th style={{ width: 80 }}>Row</th>
                              <th style={{ width: 160 }} >Sensor Type</th>
                              <th style={{ width: 150 }}>Added date</th>
                              <th style={{ width: 345 }}>File</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row) => (
                              <tr key={row.name}>
                                <td>{row.name}</td>
                                <td>{row.calories}</td>
                                <td>{row.fat}</td>
                                <td>{row.carbs}</td>
                               
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Sheet>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
