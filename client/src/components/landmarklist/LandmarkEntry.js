import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';

const LandmarkEntry = (props) => {
    const { data } = props;
    console.log("data", data);
    const name = data[0];
    const id = data[1];
    const check = id === props.activeRegionID;
    const region = props.activeMap.regions.filter(region => region._id === id)[0];
    const [editingName, toggleNameEdit] = useState(false);

    
    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value: "No Name";
        const prevName = name;
        if(newName !== prevName){
            props.handleUpdateLandmark(prevName, newName);
        }
    }

    return(
        <WRow style={{paddingTop:"20px", textAlign:"center"}}>
           { check ?
                <WCol size="1">
                    <i className="material-icons" onClick={() => props.handleDeleteLandmark(name)} style={{color:"red", cursor:"pointer"}}>close</i>
                </WCol>:
                <WCol size="1">

                </WCol>
            }
            { check&&!editingName&&
                <WCol size="5" onClick={() => toggleNameEdit(true)}>
                    {name}
                </WCol>
            }
            {
                editingName&& 
                <WCol size="5">
                     <WInput
                    className='table-input' onBlur={handleNameEdit}
                    onKeyDown={(e) => {if(e.keyCode === 13) handleNameEdit(e)}}
                    autoFocus={true} defaultValue={name} type='text'
                    inputClass="table-input-class"
                     />
                </WCol>
                
            }
            {
                !check &&
                <WCol size="5">
                {name} -- {region.name}
            </WCol>
            }
        </WRow>
    );

};

export default LandmarkEntry;