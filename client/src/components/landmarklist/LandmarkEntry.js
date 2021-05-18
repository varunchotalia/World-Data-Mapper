import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';

const LandmarkEntry = (props) => {
    const { data } = props;
    console.log("data", data);
   const name = data[0];

    return(
        <WRow style={{paddingTop:"20px", textAlign:"center"}}>
            {name}
        </WRow>
    );

};

export default LandmarkEntry;