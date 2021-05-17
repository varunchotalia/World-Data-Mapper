import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';
import {BrowserRouter as Router, Link,} from "react-router-dom";
import DeleteRegion 							from '../modals/DeleteRegion';
import { useHistory } from "react-router-dom";

const RegionEntry = (props) => {
    const { data } = props;
    const history = useHistory();

    const name = data.name;
    const capital = data.capital;
    const leader = data.leader;
    const landmarks = data.landmarks;

    const [showDeleteRegion, toggleShowDeleteRegion] 	= useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);
    const [editingName, toggleNameEdit] = useState(false);

    const newTo ={
        pathname: `/subregion/${data._id}`,
        // param1: data,
        // param2: props.parentName
        state:{
            activeRegion: data, activeMapId: props.activeMap._id
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

    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value: "No Name";
        const prevName = name;
        if(newName !== prevName){
            props.editRegion(data._id, 'name', newName, prevName);
        }
    }

    const handleDeleteRegion = () => {
        props.handleDeleteRegion(data, props.index);
    }

    const handleNameLinkClick = () => {
        props.tps.clearAllTransactions();
        history.push(newTo);
       // window.location.reload();
        props.reloadList();
    }

    // onClick={() => props.deleteRegion(data, props.index)}
    return(
        <WRow style={{paddingTop:"20px", textAlign:"center"}}>
            <WCol size="1">
                <i className="material-icons" onClick={() => toggleShowDeleteRegion(true)} style={{color:"red", cursor:"pointer"}}>close</i>
            </WCol>
        {
                editingName || name === '' 
                ?<WCol size="1">
                     <WInput
                    className='table-input' onBlur={handleNameEdit}
                    onKeyDown={(e) => {if(e.keyCode === 13) handleNameEdit(e)}}
                    autoFocus={true} defaultValue={name} type='text'
                    inputClass="table-input-class"
                     />
                    {/* <i className="material-icons small" style={{color: "grey", pointerEvents: "none"}}>edit</i> */}
                    {/* <i className="material-icons small" onClick={() => toggleNameEdit(!editingName)}>edit</i> */}
                </WCol>
                : 
                <WCol size="1">
                     <div onClick={handleNameLinkClick} style={{cursor:"pointer", color:"blue"}}>{name}</div>
                     {/* <i className="material-icons small" style={{cursor:"pointer", paddingLeft:"5px"}} onClick={() => toggleNameEdit(!editingName)}>edit</i> */}
                </WCol> 
        }
        {
                editingName||name === ''
                ?<WCol size="1">
                    <i className="material-icons small" style={{color: "grey", pointerEvents: "none"}}>edit</i>
                </WCol>
                :<WCol size="1">
                    <i className="material-icons small" style={{cursor:"pointer", paddingLeft:"5px"}} onClick={() => toggleNameEdit(!editingName)}>edit</i>
                </WCol>
        }
        <WCol size="2" >
            {
                editingCapital || capital === ''
                ? <WInput
                className='table-input' onBlur={handleCapitalEdit}
                onKeyDown={(e) => {if(e.keyCode === 13) handleCapitalEdit(e)}}
                autoFocus={true} defaultValue={capital} type='text'
                inputClass="table-input-class"
                />: <div className="table-text"
                onClick={() => toggleCapitalEdit(!editingCapital)} style={{cursor:"pointer"}}
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
                onClick={() => toggleLeaderEdit(!editingLeader)} style={{cursor:"pointer"}}
                >{leader} 
                </div> 
            }
        </WCol>
        <WCol size="2" >Flag</WCol>
        <WCol size="3" ><Link onClick={() => props.tps.clearAllTransactions()} to={newTo} >{landmarks[0]}, ...</Link></WCol>
        {showDeleteRegion && <DeleteRegion deleteRegion={handleDeleteRegion} deleteRegionName={name} setShowDeleteRegion={toggleShowDeleteRegion} />}
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

// `/subregion/${data._id}`
//this.props.location.state