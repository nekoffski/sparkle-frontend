import React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import Button from '@mui/material/Button';


class PingButton extends React.Component  {
    constructor(props) {
        super(props);

        this.state = {
            isOpened: false,
            dialogWindowContent: null,
        }
    }

    render() {
        const handlePingOpen = () => {
            const url = `http://${this.props.serverIp}:5555/ping`
            
            const requestBeginTime = Date.now();

            fetch(url).then((res) => {
                const timeSpent = (Date.now() - requestBeginTime);

                this.setState({
                    dialogWindowContent: `Server responsed correctly. Ping request took ${timeSpent}ms` 
                });
            }).catch(err => { 
                console.error(err);

                this.setState({
                    dialogWindowContent: `Could not ping server due to: ${err}`
                });

            }).finally(() => this.setState({ isOpened: true }));
        };

        return (
            <React.Fragment>
                <Button onClick={handlePingOpen} size="small" variant="outlined">Ping</Button>
                <Dialog
                    open={this.state.isOpened}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            { this.state.dialogWindowContent != null ? this.state.dialogWindowContent : "" }
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ isOpened: false })}>Okay</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
};

export default PingButton;