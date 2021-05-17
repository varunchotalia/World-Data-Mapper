import React        from 'react';
import RegionEntry   from './RegionEntry';

const RegionList = (props) => {

    let entries = props.activeList ? props.activeList.regions : null;
    //let entries = props.regionList || props.regionList[0] !== {} ? props.regionList : null;
    let entryCount = 0;
  //  console.log(entries[0]);
    if(entries) {
        entries = entries.filter(entry => entry !== null);
        entries = entries.filter(entry => entry.parent === props.activeRegionID);
        entryCount = entries.length;
    } 
    
    return (
        entries !== null && entries.length > 0 ? <div className=' table-entries container-primary'>
            {
                entries.map((entry, index) => (
                    <RegionEntry
                        data={entry} key={entry._id} index={index} entryCount={entryCount}
                        activeMap={props.activeList} editRegion={props.editRegion}
                        _id={entry._id} handleDeleteRegion={props.deleteRegion}
                        tps={props.tps} reloadList={props.reloadList}
                        // deleteItem={props.deleteItem} reorderItem={props.reorderItem}
                        // editItem={props.editItem}
                    />
                ))
            }

            </div>
            : <div className='container-primary' >
                {
                    props.activeList ? <h2 className="nothing-msg"> Nothing to do!</h2> : <></> 
                }               
                
            </div>
    );
};

export default RegionList;