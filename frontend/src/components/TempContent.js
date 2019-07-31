import React from 'react';

import background from './bgpic.jpg'

class TempContent extends React.Component {
    render() {
        return (
            <img src={background} style={{width:"100%", height:"100%"}} alt="a background not found"/>
            
        )
    }
}

export default TempContent;