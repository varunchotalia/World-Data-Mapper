import React, { useState }  from 'react';
import { WNavItem, WInput, WCol, WRow } from 'wt-frontend';
import DeleteMap 							from '../modals/DeleteMap';
import {BrowserRouter as Router, Link,} from "react-router-dom";
  

const MapEntry = (props) => {
    const [showDeleteMap, toggleShowDeleteMap] 	= useState(false);
    const [editing, toggleEditing] = useState(false);
    const [preEdit, setPreEdit] = useState(props.name);
    const handleEditing = (e) => {
        e.stopPropagation();
        setPreEdit(props.name);
        toggleEditing(!editing);
    };

    const handleSubmit = (e) => {
        handleEditing(e);
        const { name, value } = e.target;
        if(name!== props.name)
            props.updateListField(props._id, name, value, preEdit);
    };

    const handleDelete = () =>{
        props.handleDeleteMap(props._id);
    }
    
    return (
        <WNavItem>
            {
                editing ?  
                            <WRow className="table-entry" >
							    <WCol size="6">
                                    <WInput className="list-item-edit" inputClass="list-item-edit-input"
                                    onKeyDown={(e) => {if(e.keyCode === 13) handleSubmit(e)}}
                                    name='name' onBlur={handleSubmit} autoFocus={true} defaultValue={props.name} 
                                    />
                                </WCol>
                                <WCol size="2">
                                <i className="material-icons small" style={{color: "grey", pointerEvents: "none"}} >edit</i>
                                </WCol>
                                <WCol size="2">
                                <i className="material-icons small" style={{color: "grey", pointerEvents: "none"}} >delete</i>
                                </WCol>
                            </WRow>
                        :  
                            <WRow className="table-entry" >
							    <WCol size="6">
                                <Link to={`region/${props._id}`}>{props.name}</Link>
                                </WCol>
                                <WCol size="2">
                                <i className="material-icons small" onClick={handleEditing}>edit</i>
                                </WCol>
                                <WCol size="2">
                                <i className="material-icons small" onClick={() => toggleShowDeleteMap(true)}>delete</i>
                                </WCol>
                            </WRow>
            }
            {showDeleteMap && <DeleteMap deleteMap={handleDelete} deleteMapName={props.name} setShowDeleteMap={toggleShowDeleteMap} />}
        </WNavItem>
        
    );
};

export default MapEntry;