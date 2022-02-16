import React from 'react';

import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Info from './InfoComponent';
import Servers from './ServersComponent';
import Devices from './DevicesComponent';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


let TabPanel = (props) => {
    const { children, value, index, ...other } = props;
  
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
        {
            value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )
        }
        </div>
    );
}
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const  a11yProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
  


export default function Main() {
    const [value, setValue] = React.useState(0);
  
    const handleChange = (_, newValue) => {
      setValue(newValue);
    };
  
    return (
        <Box sx={{ width: '100%' }}>
            <Header/>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Info" {...a11yProps(0)} />
                <Tab label="Servers" {...a11yProps(1)} />
                <Tab label="Devices" {...a11yProps(2)} />
            </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Info/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Servers/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Devices/>
            </TabPanel>
            <Footer/>
        </Box>
    );
}



