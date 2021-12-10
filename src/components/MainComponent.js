import React from 'react';

import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Info from './InfoComponent';
import Servers from './ServersComponent';
import Devices from './DevicesComponent';

import { Switch, Route, Redirect, withRouter } from 'react-router-dom'


const Main = () => {
    return (
        <div>
            <Header/>

            <Switch>
                <Route path='/info' component={Info}/>
                <Route path='/servers' component={Servers}/>
                <Route path='/devices' component={Devices}/>
                <Redirect to='/info'></Redirect>

            </Switch>
            <Footer/>
        </div>
    );
};

export default withRouter(Main);