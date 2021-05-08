import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';
import {BrowserRouter as Router, Link,} from "react-router-dom";

const RegionEntry = (props) => {
    const { data } = props;

    const name = data.name;
    const capital = data.capital;
    const leader = data.leader;
    const landmarks = data.landmarks;

    const newTo ={
        pathname: `subregionview/${data._id}`,
        // param1: data,
        // param2: props.parentName
        state:{
            data: data, name: props.parentName
        }
    };

    return(
        <WRow style={{paddingTop:"20px", textAlign:"center"}}>
        <WCol size="2" ><Link to={`/region/${data._id+1}`}>{name}</Link></WCol>
        <WCol size="3" >{capital}</WCol>
        <WCol size="2">{leader}</WCol>
        <WCol size="2" >Flag</WCol>
        <WCol size="3" ><Link to={newTo} >{landmarks[0]}, ...</Link></WCol>
    </WRow>
    );
};

export default RegionEntry;

// your route setup
{/* <Route path="/category/:catId" component={Category} / >

// your link creation
const newTo = { 
  pathname: "/category/595212758daa6810cbba4104", 
  param1: "Par1" 
};
// link to the "location"
// see (https://reacttraining.com/react-router/web/api/location)
<Link to={newTo}> </Link>

// In your Category Component, you can access the data like this
this.props.match.params.catId // this is 595212758daa6810cbba4104 
this.props.location.param1 // this is Par1 */}
