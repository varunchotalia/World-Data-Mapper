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
import { useHistory, useParams, useLocation } from "react-router-dom";
import WMMain from 'wt-frontend/build/components/wmodal/WMMain';
import WSidebar from 'wt-frontend/build/components/wsidebar/WSidebar';
import { EditRegion_Transaction} 				from '../../utils/jsTPS';

const RegionViewer = (props) =>{

    // const keyCombination = (e, callback) => {
	// 	if(e.key === 'z' && e.ctrlKey) {
	// 		if(props.tps.hasTransactionToUndo()) {
	// 			tpsUndo();
	// 		}
	// 	}
	// 	else if (e.key === 'y' && e.ctrlKey) { 
	// 		if(props.tps.hasTransactionToRedo()) {
	// 			tpsRedo();
	// 		}
	// 	}
	// }
	// document.onkeydown = keyCombination;

    const history = useHistory();
    const location = useLocation()
    const {activeMapId, activeReg} = location.state;
    const auth = props.user === null ? false : true;
    let { id } = useParams();
    const [activeRegionID, setActiveRegionID] 	= useState(id);
  //  const [parentID, setParentID] = useState(activeRegion.parent);
    const [canUndo, setCanUndo] = useState(props.tps.hasTransactionToUndo());
	const [canRedo, setCanRedo] = useState(props.tps.hasTransactionToRedo());

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
    let maps = [];
    let regionList = [];
    let activeMap = null;
    let activeRegion = null;
    let parentName = null;
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data) { 
	
		for(let map of data.getAllMaps) {
			maps.push(map)
		}
	
        let tempID = activeMapId;
		activeMap = maps.find(list => list._id === tempID);
        // console.log("list", list);
        // console.log("activeMap", activeMap);
		//activeMap = maps.filter(map => map._id === tempID )[0];
        if(activeMap){
            activeRegion = activeMap.regions.filter(region => region._id === activeRegionID)[0];
            regionList = activeMap.regions.filter(region => region.parent === activeRegionID);
            if(activeRegion.parent === activeMap._id){
                parentName = activeMap.name;
            }
            else {
                parentName = activeMap.regions.filter(region => region._id === activeRegion.parent)[0].name;
            }
            
            // if(regionCheck.parent !== activeRegion.parent)
            //     activeRegion = regionCheck;
        }
	}

    const mutationOptions = {
		refetchQueries: [{ query: GET_DB_MAPS }], 
		awaitRefetchQueries: true,
		//onCompleted: () => reloadList()
	}

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

    const [showUpdate, toggleShowUpdate] 	= useState(false);

    const client = useApolloClient();

	const [Logout] = useMutation(LOGOUT);
    const [UpdateRegion]        = useMutation(mutations.UPDATE_REGION_FIELD, mutationOptions);

    const handleLogout = async (e) => {
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.resetStore();
        }
        history.push("/welcome");
    };

    const setShowUpdate = () => {
		toggleShowUpdate(!showUpdate);
	};

   // console.log("the value is "+ location.state.data);

    const handleLogoClick = () => {
        props.tps.clearAllTransactions();
        history.push("/maps");
    }

    const handleParentNameClick = () => {
        props.tps.clearAllTransactions();
        if(activeRegion.parent === activeMap._id){
            history.push(`/region/${activeRegion.parent}`);
        }
        else {
            history.push({pathname: `/subregion/${activeRegion.parent}`, 
            state: {activeRegion: activeMap.regions.find(region => region._id === activeRegion.parent), activeMapId: activeMapId}});
        }
    }

    const handleParentNameEdit = (e) => {
        toggleParentNameEdit(false);
        const newParentName = e.target.value ? e.target.value: parentName;
        const prevParentName = parentName;
        if(newParentName !== prevParentName){
            const nameCheck = activeMap.regions.filter(region => region.name === newParentName);
            if(newParentName === activeMap.name)
                editRegion(activeRegionID, 'parent', activeMap._id, activeRegion.parent);
            else if(newParentName === activeRegion.name)
                alert("A region's cannot be a parent of itself.")
            else if(nameCheck.length !== 0)
                editRegion(activeRegionID, 'parent', nameCheck[0]._id, activeRegion.parent);
            else    
                alert("Parent not found.");
        }
    }

    const editRegion = (regionId, field, value, prev) => {
        let transaction = new EditRegion_Transaction(activeMap._id, regionId, field, prev, value, UpdateRegion);
		props.tps.addTransaction(transaction);
		tpsRedo();
      //  window.location.reload();
    }

    const [editingParentName, toggleParentNameEdit] = useState(false);

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
                            <WButton className="navbar-options"  onClick={setShowUpdate} wType="texted" > 
                                {auth?props.user.name:"Loading"}
                            </WButton>
                        </WNavItem>
                        <WNavItem hoverAnimation="lighten">
                            <WButton className="navbar-options" onClick={handleLogout} style={{color:"white"}}  wType="texted" hoverAnimation="text-primary">
                                Logout
                            </WButton>
                        </WNavItem>
                    </ul>
                </WNavbar>
            </WLHeader>
           
             {/* <WCard wLayout="header-content" style={{ width: "375px", height: "700px" }} raised className="example-layout-labels"> */}
             <WLSide side="left">
                 <WSidebar style={{paddingTop:"50px"}}>
                    {/* <WCHeader style={{ backgroundColor: "red", color: "white" }}>Region Information</WCHeader> */}
                    {/* <WCContent style={{ backgroundColor: "grey" }}> */}
                    <WRow style={{paddingTop:"10px", color: "white"}}>
                            <WCol size="7">
                            Region Name:  {activeRegion?activeRegion.name:""}
                            </WCol>
                        </WRow>
                        <WRow style={{paddingTop:"20px", color: "white"}}>
                            <WCol size="4">
                            Parent Region: 
                            </WCol>
                        {    editingParentName || parentName === ''
                            ?<WCol size="4">
                                    <WInput className='table-input' onBlur={handleParentNameEdit}
                                    onKeyDown={(e) => {if(e.keyCode === 13) handleParentNameEdit(e)}}
                                    autoFocus={true} defaultValue={parentName?parentName:"Loading Name..."}
                                    type='text' inputClass="table-input-class"/>
                            </WCol>  
                            :<WCol size="4" >
                                <div className="table-text" onClick={handleParentNameClick} style={parentName?{color: "blue", cursor: "pointer"}:{color: "white", pointerEvents: "none"}}>{parentName?parentName:"Loading Name..."}</div>
                                </WCol>   
                            }
                        {
                            editingParentName || parentName === ''
                            ?<WCol size="1">
                                <i className="material-icons small" style={{color: "grey", pointerEvents: "none"}}>edit</i>
                            </WCol>
                            :<WCol size="1">
                                <i className="material-icons small" style={{cursor:"pointer", paddingLeft:"5px"}} onClick={() => toggleParentNameEdit(!editingParentName)}>edit</i>
                            </WCol>
                        }
                                
                        </WRow>
                        <WRow style={{paddingTop:"20px", color: "white"}}>
                            <WCol size="7">
                            Region Capital: {activeRegion?activeRegion.capital:""}
                            </WCol>
                        </WRow>
                        <WRow style={{paddingTop:"20px", color: "white"}}>
                            <WCol size="7">
                            Region Leader: {activeRegion?activeRegion.leader:""}
                            </WCol>
                        </WRow>
                        <WRow style={{paddingTop:"20px", color: "white"}}>
                            <WCol size="7">
                            Number of Sub-regions: 0
                            </WCol>
                        </WRow>
                    {/* </WCContent> */}
                    </WSidebar>
            </WLSide>
            {/* </WCard> */}
            <WLMain>
            <WRow >
                <WCol size="1" style={{paddingTop:"20px", color: "white", paddingTop: "10px", paddingLeft: "350px"}}>  Region Landmarks:</WCol>
            </WRow>
            <WCard wLayout="content-footer" style={{ width: "375px", height: "400px", marginLeft:"350px", overflow: "auto"}} raised className="example-layout-labels">
                <WCContent style={{ backgroundColor: "black" }}>Content<label>w x h</label></WCContent>
                <WCFooter style={{ backgroundColor: "lightgray" }}>Footer<label>w x h</label></WCFooter>
            </WCard>
            </WLMain>
            {
				showUpdate && (<UpdateAccount fetchUser={props.fetchUser} user={props.user} setShowUpdate={setShowUpdate} />)
			}
        </WLayout>
    );
};

export default RegionViewer;