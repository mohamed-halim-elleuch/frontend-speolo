import React, { useEffect, useState } from 'react';
import {Container,Typography,Card,CardContent,Button,List,ListItem,ListItemText,Divider,Grid,Box,Avatar} from '@mui/material';
import { fetchUserInfo } from '../../apis/UserController';
import dateFormat from 'dateformat';
import ListItemButton from '@mui/material/ListItemButton';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import  {listItemDecoratorClasses,} from '@mui/joy/ListItemDecorator';
import { useTranslation } from 'react-i18next';
import { searchObservations } from '../../apis/CaveObservationController';
import { getCaveById } from '../../apis/CaveController';
import dayjs, { Dayjs } from 'dayjs';
import { getSensorTypeById } from '../../apis/SensorTypeController';
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
  const {t} = useTranslation("translation");
  const [index, setIndex] = React.useState(0);
  const [user, setUser] = useState({firstName:'',lastName:'',email:'',license:'',createdAt:''});
  const [groupedData, setGroupedData] = useState([]);
  const [selectedCaveData, setSelectedCaveData] = useState([]);
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

    const fetchUserObs = async () => {
      try{
        const originalData = await searchObservations(`{"createdBy":"${user._id}"}`);
        

        // Group the data by caveId
        const groupedByCaveId = originalData.reduce((acc, item) => {
          const { caveId } = item;
          if (!acc[caveId]) {
            acc[caveId] = [];
          }
          acc[caveId].push(item);
          return acc;
        }, {});
        // Set the grouped data in the state
        setGroupedData(groupedByCaveId);
        const uniqueCaveIds = Object.keys(groupedByCaveId);
        // Use Promise.all to wait for all requests to complete
        await Promise.all(
          uniqueCaveIds.map(async (caveId) => {
            try {
              const response = await getCaveById(caveId);
              const caveName = response.name;

              // Update state with cave name
              setGroupedData((prevData) => ({
                ...prevData,
                [caveId]: prevData[caveId].map((item) => ({
                  ...item,
                  caveName,
                })),
              }));
              
              setSelectedCaveData(groupedData[0]);
            } catch (error) {
              console.error(`Error fetching cave name for ${caveId}:`, error);
            }
          })
        );

        
      }catch(error){
        console.log("Error getting user contributions");
      }
    };



    fetchData();
    fetchUserObs()
    console.log("user page: ",user);
    console.log("grouped data: ",groupedData);
    console.log("grouped data2: ",selectedCaveData);
    

  }, [user.email]);

  const getinfofile= async(data)=>{
    const responses =await Promise.all(
    data.map(async(item)=>{
          const formattedBeginDate = item?.beginDate ? dayjs(item.beginDate).format('MMM DD, YYYY') : 'no_date';
          const formattedEndDate = item?.endDate ? dayjs(item.endDate).format('MMM DD, YYYY') : 'no_date';
          const datePart = `${formattedBeginDate}_${formattedEndDate}`;
          const fileName = `${item?.timeZone}_${datePart}.csv` || 'file.csv';
          
          const sensorID = item?.sensorId || '';
          const resSensor = await getSensorTypeById(sensorID);
          
         console.log('r ',resSensor?.data?.name);
          
          return { ...item,"sensor_type":resSensor?.data?.name, "fileName": fileName  };
    }));
  return responses;
  }
  const caveNames = Object.values(groupedData).map((caveId) => ({
    id: caveId[0].caveId,text: caveId[0].caveName,
  }));

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
                <Button variant="contained">{t('User.add')}</Button>
                <Button variant="contained" color="success" style={{ marginLeft: '8px' }}>{t('User.edit')}</Button>
                <Button variant="outlined" color="error" style={{ marginLeft: '8px' }}>{t('User.delete')}</Button>
              </div>
            </CardContent>
          </Card>
<br />
<Card>
      <CardContent sx={{ padding: 0, height: '252px', overflowY: 'auto' }}>
        <List
          aria-label="Sidebar"
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
            padding: 0,
          }}
          className="rounded-3"
        >
          {caveNames.map((item, indexdata) => (
            <React.Fragment key={indexdata}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={index === indexdata}
                  onClick={async() => {
                    setIndex(indexdata);
                    console.log(indexdata);
                    const info = await getinfofile(groupedData[item.id]);
                    setSelectedCaveData(info);
                    console.log("grouped data2: ",info);
                  }}
                  component="a"
                  href="#simple-list"
                  className="d-flex justify-content-between align-items-center p-3"
                >
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
              {indexdata !== caveNames.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
          </Grid>
          
          <Grid item lg={8}>
            <Card className="mb-4">
              <CardContent>
                <Grid container>
                  {[
                    
                    { label: `${t('User.name')}`, value: `${user.firstName} ${user.lastName}` },
                    { label: `${t('User.license')}`, value: user.license },
                    { label: `${t('User.email')}`, value: user.email },
                    { label: `${t('User.phone')}`, value: '(097) 234-5678' },
                    { label: `${t('User.address')}`, value: 'Bay Area, San Francisco, CA' },
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
                              <th style={{ width: 80 }}>{t('User.row')}</th>
                              <th style={{ width: 160 }} >{t('User.sensor')}</th>
                              <th style={{ width: 150 }}>{t('User.added')}</th>
                              <th style={{ width: 345 }}>{t('User.file-name')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedCaveData?.map((row,index) => (
                              <tr key={index+1}>
                                <td>{index+1}</td>
                                <td>{row?.sensor_type}</td>
                                <td>{row?.fat}</td>
                                <td>{row?.fileName}</td>
                               
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
