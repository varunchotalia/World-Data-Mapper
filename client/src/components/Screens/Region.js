import Logo 							from '../navbar/Logo';
import UpdateAccount 							from '../modals/UpdateAccount';
import * as mutations 					from '../../cache/mutations';
import { GET_DB_MAPS } 				from '../../cache/queries';
import RegionList                      from '../regionlist/RegionList';
import React, { useState } 				from 'react';
import { LOGOUT }                           from '../../cache/mutations';
import { useMutation, useQuery, useApolloClient } 		from '@apollo/client';
import { WNavbar, WNavItem, WButton, WCard, WCContent, WCFooter, WCHeader, WInput, WRow, WCol } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { useHistory, useParams } from "react-router-dom";
import WMMain from 'wt-frontend/build/components/wmodal/WMMain';
import { EditRegion_Transaction, UpdateRegions_Transaction,
    SortRegions_Transaction } 				from '../../utils/jsTPS';

const Region = (props) => {

    const keyCombination = (e, callback) => {
		if(e.key === 'z' && e.ctrlKey) {
			if(props.tps.hasTransactionToUndo()) {
				tpsUndo();
			}
		}
		else if (e.key === 'y' && e.ctrlKey) { 
			if(props.tps.hasTransactionToRedo()) {
				tpsRedo();
			}
		}
	}
	document.onkeydown = keyCombination;

    const history = useHistory();
    const auth = props.user === null ? false : true;
    let maps = [];
    let MapData = [];
    let { id } = useParams();
    const [sortRule, setSortRule] = useState('unsorted'); // 1 is ascending, -1 desc
    const [activeRegionID, setActiveRegionID] 	= useState(id);
    const [index, setIndex] = useState(0);
    const [canUndo, setCanUndo] = useState(props.tps.hasTransactionToUndo());
	const [canRedo, setCanRedo] = useState(props.tps.hasTransactionToRedo());
    const [disabled, toggleDisabled] = useState(false);
  //  const [regionList, setRegionList] = useState({});
    //const [parent, setParent] = useState()

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
    let activeRegion = null;
    let regionList = {};
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data) { 
	
		for(let map of data.getAllMaps) {
			maps.push(map)
		}
	
		for(let map of maps) {
			if(map) {
				MapData.push({_id: map._id, name: map.name});
			}	
		}
        // let tempID = activeRegionID;
		// let list = maps.find(list => list._id === tempID);
		activeRegion = maps.filter(map => map._id === activeRegionID )[0];
        if(activeRegion){
            regionList = activeRegion.regions.filter(region => region.parent === activeRegionID);
            console.log("reach", regionList);   
        }
        // setRegionList(activeRegion.filter(region => region.parent === activeRegionID));
	}

    const reloadList = async() =>{
        let tempID = activeRegionID;
		let list = maps.find(list => list._id === tempID);
		activeRegion = (list);
        regionList = activeRegion.regions.filter(region => region.parent === activeRegionID);
    }

    const mutationOptions = {
		refetchQueries: [{ query: GET_DB_MAPS }], 
		awaitRefetchQueries: true,
		onCompleted: () => reloadList()
	}
    
    console.log(maps);
    console.log(activeRegion);

    const [showUpdate, toggleShowUpdate] 	= useState(false);

    const client = useApolloClient();

	const [Logout] = useMutation(LOGOUT);
    const [sortRegions] 		= useMutation(mutations.SORT_REGIONS, mutationOptions);
    const [AddRegion] 			= useMutation(mutations.ADD_REGION, mutationOptions);
    const [DeleteRegion] 			= useMutation(mutations.DELETE_REGION, mutationOptions);
    const [UpdateRegion]        = useMutation(mutations.UPDATE_REGION_FIELD, mutationOptions);

    const handleLogout = async (e) => {
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.resetStore();
        }
        props.tps.clearAllTransactions();
        history.push("/welcome");
    };

    const setShowUpdate = () => {
		toggleShowUpdate(!showUpdate);
	};

    const tpsUndo = async () => {
		const ret = await props.tps.undoTransaction();
		if(ret) {
			setCanUndo(props.tps.hasTransactionToUndo());
			setCanRedo(props.tps.hasTransactionToRedo());
		}
	}

	const tpsRedo = async () => {
		const ret = await props.tps.doTransaction();
		if(ret) {
			setCanUndo(props.tps.hasTransactionToUndo());
			setCanRedo(props.tps.hasTransactionToRedo());
		}
	}

    const addRegion = async () => {
		let list = activeRegion;
		const newRegion = {
			_id: '',
			name: 'No Name',
			capital: 'No capital',
			leader: 'No One',
			landmarks: ["No landmarks"],
            parent: activeRegionID
            // children: []
		};
        let opcode = 1;
		let regionID = newRegion._id;
        console.log("regionid is "+regionID);
        let transaction = new UpdateRegions_Transaction(activeRegionID, regionID, newRegion, opcode, AddRegion, DeleteRegion);
		props.tps.addTransaction(transaction);
		tpsRedo();
        //const { data } = await AddRegion({ variables: { region: newRegion, _id: activeRegionID, index: index}});
        setIndex(index+1);	
	};

    const editRegion = async (regionId, field, value, prev) => {
        //const { data } = await UpdateRegion({ variables: { _id: activeRegionID, regionId: regionId, field: field, value: value}});
		let transaction = new EditRegion_Transaction(activeRegionID, regionId, field, prev, value, UpdateRegion);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

    const deleteRegion = async (region, index) => {
        //const { data } = await DeleteRegion({ variables: { regionId: regionId, _id: activeRegionID}});
        let regionID = region._id;
		let opcode = 0;
		let regionToDelete = {
			_id: region._id,
			name: region.name,
			capital: region.capital,
			leader: region.leader,
			landmarks: region.landmarks,
            parent: region.parent
		}
		let transaction = new UpdateRegions_Transaction(activeRegionID, regionID, regionToDelete, opcode, AddRegion, DeleteRegion, index);
		props.tps.addTransaction(transaction);
		tpsRedo();
    }

    const sort = (criteria) => {
		let prevSortRule = sortRule;
		setSortRule(criteria);
		let transaction = new SortRegions_Transaction(activeRegionID, criteria, prevSortRule, sortRegions);
		console.log(transaction);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

    const clickDisabled = () => { };

    const undoOptions = {
        className:"material-icons",
        id: disabled || !canUndo ? ' table-header-button-disabled ' : 'table-header-button',
        onClick: disabled || !canUndo  ? clickDisabled : tpsUndo,
        wType: "texted", 
        clickAnimation: disabled || !canUndo ? "" : "ripple-light",  
        shape: "rounded"
    }

    const redoOptions = {
        className:"material-icons",
        id: disabled || !canRedo ? ' table-header-button-disabled ' : 'table-header-button ',
        onClick: disabled || !canRedo   ? clickDisabled : tpsRedo, 
        wType: "texted", 
        clickAnimation: disabled || !canRedo ? "" : "ripple-light" ,
        shape: "rounded"
    }

    const handleLogoClick = () =>{
        props.tps.clearAllTransactions();
        history.push("/maps");
    }

    let tempID = 0;
    return (
        <WLayout wLayout="header-lside">
            <WLHeader>
                <WNavbar className="welcome-navbar">
                    <ul>
                        <WNavItem onClick={handleLogoClick} style={{cursor:"pointer"}}>
                            <Logo className='logo' />
                        </WNavItem>
                    </ul>
                    <ul>
                        <WNavItem hoverAnimation="lighten">
                            <WButton className="navbar-options"  onClick={setShowUpdate} style={{cursor:"pointer"}} wType="texted" > 
                                 {auth?props.user.name:"Loading"}
                            </WButton>
                        </WNavItem>
                        <WNavItem hoverAnimation="lighten">
                            <WButton className="navbar-options" onClick={handleLogout} style={{color:"white", cursor:"pointer"}}  wType="texted" hoverAnimation="text-primary">
                                Logout
                            </WButton>
                        </WNavItem>
                    </ul>
                </WNavbar>
            {    
              activeRegion &&  
              
              <WRow style= {{fontSize: "25px", paddingLeft: "246px", paddingTop: "50px"}}>
                <WCol size="2">
                        <i className="material-icons" onClick={addRegion} style={{color: "green", cursor:"pointer"}} >add</i>
                </WCol>
                <WCol size="1">
                    <i  {...undoOptions} className="material-icons">undo</i>
                    <i {...redoOptions} className="material-icons">redo</i>
                </WCol>
                <WCol size="1" style={{marginLeft:"0px"}}></WCol>
                <WCol style={{color:"white"}} > Region:</WCol>
                <WCol size= "2">{" "+activeRegion.name}</WCol>
              </WRow>
            }
            </WLHeader>
            <WCard wLayout="header-content-footer" style={{ width: "1025px", height: "550px", position: "fixed", left: "16%", top: "20%", overflowY: "auto"}} raised className="example-layout-labels">
                <WCHeader style={{ backgroundColor: "red", color: "white"}}>
                    <WRow style={{paddingTop:"20px"}}>
                        <WCol size="1" style={{textAlign:"center"}}></WCol>
                        <WCol size="2" onClick={() => sort("name")} style={{textAlign:"center", cursor:"pointer"}}>Name</WCol>
                        <WCol size="2" onClick={() => sort("capital")} style={{textAlign:"center", cursor:"pointer"}}>Capital</WCol>
                        <WCol size="2" onClick={() => sort("leader")} style={{textAlign:"center", cursor:"pointer"}}>Leader</WCol>
                        <WCol size="2"style={{textAlign:"center"}}>Flag</WCol>
                        <WCol size="3"style={{textAlign:"center"}}>Landmarks</WCol>
                    </WRow>
                </WCHeader>
                <WCContent style={{ backgroundColor: "grey", overflowY: "auto" }}>
                  <RegionList activeList={activeRegion} editRegion={editRegion} deleteRegion={deleteRegion} regionList={regionList} 
                  tps={props.tps} activeRegionID={activeRegionID} reloadList={reloadList} />
                </WCContent>
                <WCFooter style={{ backgroundColor: "grey" }}>
               
                </WCFooter>
            </WCard>

            {
				showUpdate && (<UpdateAccount fetchUser={props.fetchUser} user={props.user} setShowUpdate={setShowUpdate} tps={props.tps}/>)
			}

        </WLayout>
    );
};

export default Region;
