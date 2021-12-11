import React, {Component} from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';


class Server {
    constructor(ip) {
        this.ip = ip;
        this.is_online = false;
    }
};

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

class Servers extends Component {
    constructor() {
        super();

        this.state = {
            servers: {
                Aurora: new Server("172.18.247.190"),
                Onyx: new Server("localhost")
            }
        };   
    }

    componentDidMount() {
        let servers = this.state.servers;

        for (let [name, server] of Object.entries(servers)) {
            const requestParams = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "command": "uname -a"
                })
            };
            
            fetch(`http://${server.ip}:5555/run`, requestParams)
            .then(response => response.json())
            .then(response => {
                servers[name].is_online = true;

                this.setState({ servers: servers });

            }).catch(error => {
                console.error(error);
            });
        }
    }

    render() {
        const servers = this.state.servers;

        return (
            <React.Fragment>
                <h3>
                    Configured Sparkle servers' status
                </h3>

                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={12}>
                        {
                            Object.keys(servers).map((key, i) => {
                                const server = servers[key];
                                let status = server.is_online ? "online" : "offline";
                                let color = server.is_online ? "green" : "red";
                                
                                return (
                                    <Grid item xs={4}>
                                        <Item>
                                            <h3>{ key }</h3>
                                            <p style={{ color: color }}>
                                                { server.ip } - { status }
                                            </p>
                                        </Item>
                                    </Grid>
                                );
                            })
                        }
                    </Grid>
                </Box>

                {/* {                    
                    Object.keys(servers).map((key, i) => {
                        return <p key={i}>{ key }-{ servers[key].is_online ? "online" : "offline" }</p>
                    })
                } */}

            </React.Fragment>
        )
    }
};

export default Servers;
