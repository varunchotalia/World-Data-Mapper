import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';
import {BrowserRouter as Router, Link,} from "react-router-dom";

const RegionEntry = (props) => {
    const { data } = props;

    const name = data.name;
    const capital = data.capital;
    const leader = data.leader;
    const landmarks = data.landmarks;

    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);

    const newTo ={
        pathname: `subregionview/${data._id}`,
        // param1: data,
        // param2: props.parentName
        state:{
            data: data, name: props.parentName
        }
    };

    const handleCapitalEdit = (e) => {
        toggleCapitalEdit(false);
        const newCap = e.target.value ? e.target.value: "No Capitl";
        const prevCap = capital;
        if(newCap !== prevCap){
            props.editRegion(data._id, 'capital', newCap, prevCap);
        }
    }

    const handleLeaderEdit = (e) => {
        toggleLeaderEdit(false);
        const newLeader = e.target.value ? e.target.value: "No Leader";
        const prevLeader = leader;
        if(newLeader !== prevLeader){
            props.editRegion(data._id, 'leader', newLeader, prevLeader);
        }
    }
    // onClick={() => props.deleteRegion(data, props.index)}
    return(
        <WRow style={{paddingTop:"20px", textAlign:"center"}}>
        <WCol size="1">
        {/* <WButton className="table-entry-buttons"  wType="texted"> */}
                    <i className="material-icons" style={{color:"red"}}>close</i>
            {/* </WButton> */}
        </WCol>
        <WCol size="2" >
            <Link to={`/subregion/${data._id}`}>{name}</Link>
            </WCol>
        
        <WCol size="2" >
            {
                editingCapital || capital === ''
                ? <WInput
                className='table-input' onBlur={handleCapitalEdit}
                // onKeyDown={(e) => {if(e.keyCode === 13) handleCapitalEdit(e)}}
                autoFocus={true} defaultValue={capital} type='text'
                inputClass="table-input-class"
                />: <div className="table-text"
                onClick={() => toggleCapitalEdit(!editingCapital)}
                >{capital} 
                </div> 
            }
        
        </WCol>
        <WCol size="2">
        {
                editingLeader || leader === ''
                ? <WInput
                className='table-input' onBlur={handleLeaderEdit}
                onKeyDown={(e) => {if(e.keyCode === 13) handleLeaderEdit(e)}}
                autoFocus={true} defaultValue={leader} type='text'
                inputClass="table-input-class"
                />: <div className="table-text"
                onClick={() => toggleLeaderEdit(!editingLeader)}
                >{leader} 
                </div> 
            }
        </WCol>
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
