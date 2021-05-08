import React        from 'react';
import MapEntry from './MapEntry';

const MapList = (props) => {
    let tempID = 0
    return (
        <>
            {
                props.listIDs &&
                props.listIDs.map(entry => (
                    <MapEntry
                        id={tempID++} key={entry._id+props.tempid} name={entry.name} _id={entry._id}
                        updateListField={props.updateListField} handleDeleteMap={props.handleDeleteMap}
                    />
                ))
            }
        </>
    );
};

export default MapList;