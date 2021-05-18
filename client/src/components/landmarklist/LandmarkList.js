import React        from 'react';
import LandmarkEntry from './LandmarkEntry';

const LandmarkList = (props) => {
    let tempID = 0;
    console.log(props.landmarks);
    return (
        <>
            {
                props.landmarks &&
                props.landmarks.map(entry => (
                    <LandmarkEntry
                        id={tempID++} key={tempID} data={entry} 
                        handleDeleteLandmark={props.handleDeleteLandmark}
                        handleUpdateLandmark={props.handleUpdateLandmark}
                        activeRegionID={props.activeRegionID} activeMap={props.activeMap}
                    />
                ))
            }
        </>
    );
};

export default LandmarkList;