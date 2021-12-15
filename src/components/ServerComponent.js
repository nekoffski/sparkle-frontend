import React, {Component} from 'react';
import Grid from '@mui/material/Grid';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';

import PingButton from './PingButtonComponent';
import ShellButton from './ShellButtonComponent';

import { styled } from '@mui/material/styles';
import ServerDescription from '../misc/ServerDescription';



const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


class Server extends Component {
    constructor(props) {
        super(props);
    }

    sendPost(command) {
        fetch(`http://${this.props.server.ip}:5555/${command}`, {
            method: 'POST',
            mode: 'cors'
        }).then(_ => {}).catch(err => console.log(err));
    }

    render() {
        const server = this.props.server;
        const status = server.is_online ? "online" : "offline";
        const color = server.is_online ? "green" : "red";
        
        const serverInfo = server.info;

        const noDataInfo = "Server is down";

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
                        <PingButton serverIp={server.ip} />
                        <Button onClick={() => this.sendPost('reboot')} size="small" variant="outlined">Reboot</Button>
                        <Button onClick={() => this.sendPost('update')} size="small" variant="outlined">Update</Button>
                        <ShellButton serverIp={server.ip} />
                    </Stack>

                    
                </Item>
            </Grid>
        );
    }

};

export default Server;
