import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Paper from '@mui/material/Paper';
import { RgbaColorPicker } from "react-colorful";

import Checkbox from '@mui/material/Checkbox';

import { styled } from '@mui/material/styles';


const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

class Devices extends React.Component {
    constructor() {
        super();

        this.state = {
            boards: [],
            useSameLedColor: false,
            ledsColor: undefined
        };

        this.canUpdate = true;
    }

    componentDidMount() {
        this.fetchDevices();
    }

    fetchDevices() {
        const requestParams = {
            method: 'GET',
            mode: 'cors'
        };

        const url = `http://192.168.1.43:5553/board/`;
        
        fetch(url, requestParams).then(response=>response.json()).then(response => {
            console.log(response.boards);
            this.setState(previousState => ({
                ...previousState,
                boards: response.boards
            }));
        }).catch(err => console.log(err));
    }

    setLedStripColor(r, g, b, board, led_id) {
        let data = {
            "r": r,
            "g": g,
            "b": b
        }

        console.log("Sending request!");

        fetch(`http://192.168.1.29:5553/board/${board}/led/${led_id}/color`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(_ => {}).catch(err => console.log(err));
    }

    setColorForAllLedStrips(r, g, b) {
        this.state.boards.forEach((board, index) => {
            board.led_strips.forEach(led => {
                this.setLedStripColor(r, g, b, index, led.id);
            });
        });
    }

    render() {
        const LedStrip = (props) => {
            const [color, setColor] = React.useState({ r: 200, g: 150, b: 35, a: 0.5 });

            const led = props.ledStrip;
            const boardId = props.boardId;

            const onChange = (c) => {
                setColor(c);

                if (!this.canUpdate) {
                    return;
                }

                this.canUpdate = false;

                setInterval(() => {
                    this.canUpdate = true;
                }, 500);

                if (props.useSameLedColor)
                    this.setColorForAllLedStrips(c.r, c.g, c.b)
                else
                    this.setLedStripColor(c.r, c.g, c.b, boardId, led.id);
            };

            return (
                <React.Fragment>
                    <Grid item xs={6}>
                        <Item>
                            <h4>
                                {led.name}
                            </h4>
                            <h5>
                                {led.location}
                            </h5>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <RgbaColorPicker color={color} onChange={onChange} />
                            </div>
                        </Item>
                    </Grid>
                </React.Fragment>
            );
        }

        const Board = (props) => {
            const leds = props.board.led_strips;
            const board = props.board;
            const id = props.boardId;

            return (
                <Grid item xs={4}>
                    <Item>
                        <h3>
                            {board.name}
                        </h3>
                        <h5>
                            {board.description}
                        </h5>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={3}>
                                {
                                    leds.map((led) => {
                                        return <LedStrip useSameLedColor={props.useSameLedColor} boardId={id} ledStrip={led} />
                                    })
                                }
                            </Grid>
                        </Box>
                    </Item>
                </Grid>
            ); 
        };

        const boards = this.state.boards;
        const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

        const useSameLedColor = this.state.useSameLedColor;

        return (
            <React.Fragment>
                <div>
                    <Checkbox 
                        {...label} 
                        checked={this.state.useSameLedColor} 
                        onChange={
                            (event) => {
                                this.setState(previousState => ({
                                    ...previousState,
                                    useSameLedColor: event.target.checked
                                }))
                            }
                        }
                    /> 
                    Use same color for all led strips
                </div>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        {
                            boards.map((board, index) => {
                                return <Board useSameLedColor={useSameLedColor} boardId={index} board={board} />
                            })
                        }
                    </Grid>
                </Box>
            </React.Fragment>
        );
    }
};

export default Devices;
