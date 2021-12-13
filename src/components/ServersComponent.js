import React, {Component} from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


class Server {
    constructor(ip) {
        this.ip = ip;
        this.is_online = false;
        this.info = null;
    }
};

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


class ServerComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogOpened: false
        };
    }

    sendPost(command) {
        fetch(`http://${this.props.server.ip}:5555/${command}`, {
            method: 'POST',
            mode: 'cors'
        }).then(res => {}).catch(err => console.log(err));
    }

    

    render() {
        const server = this.props.server;
        const status = server.is_online ? "online" : "offline";
        const color = server.is_online ? "green" : "red";
        
        const serverInfo = server.info;

        const noDataInfo = "Server is down";

        const handleClickOpen = () => {
            this.setState({dialogOpened: true});
        };
        
        const handleClose = () => {
            this.setState({dialogOpened: false});
        };

        const handleReboot = () => {
            this.sendPost('reboot');
        }
    
        const handleUpdate = () => {
            this.sendPost('update');
        }

        return (
            <Grid item xs={3}>
                <Item>
                    <h2>{ this.props.index + 1 }. { this.props.name }</h2>
                    <p style={{ color: color }}>
                        { server.ip } - { status }
                    </p>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        <ListItem>
                            <ListItemText 
                                primary="Hardware" 
                                secondary={ serverInfo != null ? serverInfo.hardware : noDataInfo } 
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText 
                                primary="Software" 
                                secondary={ serverInfo != null ? serverInfo.software : noDataInfo }
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText 
                                primary="Operating system" 
                                secondary={ serverInfo != null ? serverInfo.os : noDataInfo } 
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText 
                                primary="Uptime" 
                                secondary={ serverInfo != null ? serverInfo.uptime : noDataInfo } 
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText 
                                primary="Services" 
                                secondary={ serverInfo != null ? serverInfo.services.join(', ') : noDataInfo } 
                            />
                        </ListItem>
                    </List>
                    <Stack 
                        direction="row" 
                        spacing={2} 
                        justifyContent="center"
                        style={{ 
                            "padding": "1.5rem 0 1.5rem 0" 
                        }}
                    >
                        <Button onClick={handleClickOpen} size="small" variant="outlined">Ping</Button>
                        <Button onClick={handleReboot} size="small" variant="outlined">Reboot</Button>
                        <Button onClick={handleUpdate} size="small" variant="outlined">Update</Button>
                        <Button size="small" variant="outlined">Shell</Button>
                    </Stack>

                    <Dialog
                        open={this.state.dialogOpened}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            Server responded correctly
                        </DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Okay</Button>
                        </DialogActions>
                    </Dialog>
                </Item>
            </Grid>
        );
    }

};

class Servers extends Component {
    constructor() {
        super();

        this.state = {
            servers: {
                Aurora: new Server("172.18.247.190"),
                Onyx: new Server("localhost")
            }
        };   


        this.updateTimeout = null;
    }

    async readServerInfo(name, server) {
        const requestParams = {
            method: 'GET',
            mode: 'cors'
        };

        console.log("Reading server info from: ", server.ip)

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 500);

        try {
            const response = await fetch(`http://${server.ip}:5555/`, { signal: controller.signal }, requestParams);
            const json = await response.json();
            
            let servers = this.state.servers;

            servers[name].is_online = true;
            servers[name].info = json;

            this.setState({ servers: servers });

        } catch (error) {
            console.error(error);
            let servers = this.state.servers;

            servers[name].is_online = false;
            servers[name].info = null;

            this.setState({ servers: servers });
        }

        clearInterval(timeoutId);
    }

    readServersInfo() {
        const servers = this.state.servers;

        let fetchPromises = Object.keys(servers).map(
            (name) => this.readServerInfo(name, this.state.servers[name]));

        Promise.all(fetchPromises).then(() => {
            this.updateTimeout = setTimeout(
                this.readServersInfo.bind(this), 500  
            );
        });
    }

    componentDidMount() {
        this.readServersInfo();
    }

    componentWillUnmount(){
        if (this.updateTimeout != null)
            clearTimeout(this.updateTimeout);
    }

    render() {
        const servers = this.state.servers;

        return (
            <React.Fragment>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={12}>
                        {
                            Object.keys(servers).map((key, i) => {
                                return <ServerComponent server={servers[key]} name={key} index={i} />
                            })
                        }
                    </Grid>
                </Box>
            </React.Fragment>
        )
    }
};

export default Servers;
