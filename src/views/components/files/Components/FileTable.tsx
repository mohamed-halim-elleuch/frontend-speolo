/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
// icons
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { getSensorTypeById, getSensorTypes } from '../../../../apis/SensorTypeController';
import dayjs, { Dayjs } from 'dayjs';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { getSensors } from '../../../../apis/SensorController';
import { searchObservations } from '../../../../apis/CaveObservationController';
import { useParams } from 'react-router-dom';
import { getUsers } from '../../../../apis/UserController';
import { useTranslation } from 'react-i18next';





type Order = 'asc' | 'desc';



// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)

function RowMenu() {
  const {t} = useTranslation("translation");
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
       
        <MenuItem>{t('Obs.table.edit')}</MenuItem>
        <MenuItem>{t('Obs.table.rename')}</MenuItem>
        
        <Divider />
        <MenuItem color="danger">{t('Obs.table.delete')}</MenuItem>
      </Menu>
    </Dropdown>
  );
}


export default function FileTable() {
  const {t} = useTranslation("translation");
  const { id } = useParams();
  const [sensorType,setSensorType] = React.useState(null);
  const [order, setOrder] = React.useState<Order>('desc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));
  const [rows,setRows] = React.useState([{id: '',fileName:'',sensor_type:'',beginDate: '',endDate: '',customer: {  initial: '',  name: '',  email: '',},}]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await searchObservations(`{"caveId":"${id}"}`);
        const responses = await Promise.all(data.map(async (item) => {
       
          const formattedBeginDate = item?.beginDate ? dayjs(item.beginDate).format('MMM DD, YYYY') : 'no_date';
          const formattedEndDate = item?.endDate ? dayjs(item.endDate).format('MMM DD, YYYY') : 'no_date';
          const fileName = item?.fileName || 'file.csv';
          const resUser = await getUsers(`{"_id":"${item.createdBy}"}`);
          
          const sensorID = item.sensorId || '';
          const resSensor = await getSensorTypeById(sensorID);
          
         console.log('r ',resSensor?.data?.name);
          
          return { ...item,"sensor_type":resSensor?.data?.name ,"beginDate":formattedBeginDate,"endDate":formattedEndDate, "fileName": fileName ,"customer": {  "initial": resUser[0].lastName.charAt(0).toUpperCase(),  "name":`${resUser[0].firstName} ${resUser[0].lastName}`, "email": resUser[0].email,} };
        }));     
        setRows(responses);

        console.log("rows: ",rows)
      } catch (error) {
        setRows([]);
        console.log("rows: ",rows)
        console.error('Error fetching observation types:', error);
        // Handle errors as needed
      }
    };

    fetchData();
      }, [rows[0]?.id]);
    
      const downloadFile = (row) => {
        window.open(row.filePath, '_blank');
      };

  const renderFilters = () => (
    <React.Fragment>


      <FormControl size="sm">
        <FormLabel>{t('Obs.sensor')}</FormLabel>
        <Select size="md" placeholder={t('Obs.all')}>
          <Option value="all">{t('Obs.all')}</Option>
          <Option value="reefnet">Reefnet Sensor</Option>
          <Option value="ctd">CTD Sensor</Option>
          <Option value="pluviometer">PluvioMeter</Option>
          <Option value="other">Other</Option>
        </Select>
      </FormControl>

      <FormControl size="sm">
        <FormLabel>{t('Obs.author')}</FormLabel>
        <Select size="md" placeholder={t('Obs.all')}>
          <Option value="all">{t('Obs.all')}</Option>
          <Option value="olivia">Olivia Rhye</Option>
          <Option value="steve">Steve Hampton</Option>
          <Option value="ciaran">Ciaran Murray</Option>
          <Option value="marina">Marina Macdonald</Option>
          <Option value="charles">Charles Fulton</Option>
          <Option value="jay">Jay Hoper</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: {
            xs: 'flex',
            sm: 'none',
          },
          my: 1,
          gap: 1,
        }}
      >
        <Input
          size="sm"
          placeholder={t('Obs.search')}
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          py: 2,
          display: {
            xs: 'none',
            sm: 'flex',
          },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            minWidth: {
              xs: '120px',
              md: '160px',
            },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>{t('Obs.serach-label')}</FormLabel>
          <Input size="sm" placeholder={t('Obs.search')} startDecorator={<SearchIcon />} />
        </FormControl>
        {renderFilters()}
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: 'center', padding: '12px 12px' }}>
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== rows.length
                  }
                  checked={selected.length === rows.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? rows.map((row) => row.id) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === rows.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: "25%", padding: '12px 6px' }}>  
              {t('Obs.table.file-name')} 
              </th>
              <th style={{ width: "14%", padding: '12px 6px' }}>{t('Obs.table.sensor')}</th> 
              <th style={{ width: "14%", padding: '12px 6px' }}>{t('Obs.table.begin-date')}</th>
              <th style={{ width: "14%", padding: '12px 6px' }}>{t('Obs.table.end-date')}</th>
              <th style={{ width: "20%", padding: '12px 6px' }}>{t('Obs.table.author')}</th>
              <th style={{ width: "8%", padding: '12px 6px' }}></th>
              
            </tr>
          </thead>
          <tbody>
            {rows.length != 0 ? (rows.map((row) => (
              <tr key={row.id}>
                <td style={{ textAlign: 'center', width: 120 }}>
                  <Checkbox
                    size="sm"
                    checked={selected.includes(row.id)}
                    color={selected.includes(row.id) ? 'primary' : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(row.id)
                          : ids.filter((itemId) => itemId !== row.id),
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                    sx={{ verticalAlign: 'text-bottom' }}
                  />
                </td>
                <td>
                  <Typography level="body-xs">{row?.fileName}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row?.sensor_type}</Typography>
                  </td>
                <td>
                  <Typography level="body-xs">{row?.beginDate}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row?.endDate}</Typography>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar size="sm">{row?.customer?.initial}</Avatar>
                    <div>
                      <Typography level="body-xs">{row?.customer?.name}</Typography>
                      
                    </div>
                  </Box>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Link level="body-xs" component="button" onClick={() => downloadFile(row)}>
                      <IconButton color="primary" aria-label="download">
                        <FileDownloadIcon />
                      </IconButton>
                    </Link>
                    
                    <RowMenu />
                  </Box>
                </td>
              </tr>
            ))): (
              <tr>
                <td colSpan={5}>{t('Obs.loading')}</td>
              </tr>)}
          </tbody>
        </Table>
      </Sheet>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
          display: {
            xs: 'none',
            md: 'flex',
          },
        }}
      >
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
        >
          {t('Obs.table.previous')}
        </Button>

        <Box sx={{ flex: 1 }} />
        {['1', '2'].map((page) => (
          <IconButton
            key={page}
            size="sm"
            variant={Number(page) ? 'outlined' : 'plain'}
            color="neutral"
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />

        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
        >
          {t('Obs.table.next')}
        </Button>
      </Box>
    </React.Fragment>
  );
}
