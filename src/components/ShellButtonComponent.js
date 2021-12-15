import React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


class ShellButton extends React.Component  {
    constructor(props) {
        super(props);

        this.state = {
            isOpened: false,
            isResultOpened: false,
            stderr: null,
            stdout: null,
            time: null,
            error: null,
            command: null
        }
    }

    render() {
        const handleShell = () => {
            const url = `http://${this.props.serverIp}:5555/run`
            
            const requestBeginTime = Date.now();
            const params = {
                method: "POST",
                body: JSON.stringify({
                    command: this.state.command
                })
            };

            fetch(url, params).then(res => res.json()).then(json => {
                this.setState({
                    time: Date.now() - requestBeginTime,
                    stdout: json.stdout,
                    stderr: json.stderr,
                    error: null
                });
            }).catch(err => { 
                console.error(err);

                this.setState({
                    error: `Could execute command due to: ${err}`
                });

            }).finally(() => this.setState({ isResultOpened: true, isOpened: false }));
        };

        const Error = (props) => {
            return (
                <React.Fragment>
                    <h2>Could not execute shell command due to: </h2>
                    <p>{props.error}</p>
                </React.Fragment>
            );
        };

        const Result = (props) => {
            return (
                <React.Fragment>
                    <h4>Shell execution took {props.time} ms</h4>
                    <h5>STDOUT</h5>
                    <p>{props.stdout}</p>
                    <h5>STDERR</h5>
                    <p>{props.stderr}</p>
                </React.Fragment>
            );
        };

        const onTextInput = (e) => {
            this.setState({ command: e.target.value });
        };

        return (
            <React.Fragment>
                <Button onClick={() => this.setState({isOpened: true})} size="small" variant="outlined">Shell</Button>
                <Dialog
                    open={this.state.isOpened}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle>Execute remote command</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <TextField onChange={onTextInput} id="outlined-basic" label="Command" variant="outlined" />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleShell}>Execute</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.isResultOpened}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                        {
                            this.state.error != null ? 
                                <Error error={this.state.error} /> 
                              : <Result time={this.state.time} stdout={this.state.stdout} stderr={this.state.stderr} />
                        }
                        <DialogContentText id="alert-dialog-description"></DialogContentText>
                        </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ isResultOpened: false })}>Okay</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
};

export default ShellButton;