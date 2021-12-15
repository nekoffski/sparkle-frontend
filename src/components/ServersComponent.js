import React, {Component} from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Server from "./ServerComponent";

import ServerDescription from "../misc/ServerDescription";


class Servers extends Component {
    constructor() {
        super();

        this.state = {
            servers: {
                Aurora: new ServerDescription("172.18.247.190"),
                Onyx: new ServerDescription("localhost")
            }
        };   

        this.updateTimeout = null;
    }

    async readServerInfo(name, server) {
        const requestParams = {
            method: 'GET',
            mode: 'cors'
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 500);

        try {
            const response = await fetch(`http://${server.ip}:5555/`, { signal: controller.signal }, requestParams);
            const json = await response.json();
            
            server.is_online = true;
            server.info = json;
        } catch (error) {
            server.is_online = false;
            server.info = null;
        } finally {
            this.setState(previousState => ({
                ...previousState,
                [name]: server
            }));

            clearInterval(timeoutId);
        }   
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
                                return <Server server={servers[key]} name={key} index={i} />
                            })
                        }
                    </Grid>
                </Box>
            </React.Fragment>
        )
    }
};

export default Servers;
