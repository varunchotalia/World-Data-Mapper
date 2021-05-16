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


const Region = (props) => {
    const history = useHistory();
    const auth = props.user === null ? false : true;
    let maps = [];
    let MapData = [];
    let { id } = useParams();
    const [activeRegionID, setActiveRegionID] 	= useState(id);
    const [index, setIndex] = useState(0);

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
    let activeRegion = null;
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
	}

    const reloadList = async() =>{
        let tempID = activeRegionID;
		let list = maps.find(list => list._id === tempID);
		activeRegion = (list);
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

    const [AddRegion] 			= useMutation(mutations.ADD_REGION, mutationOptions);
    const [DeleteRegion] 			= useMutation(mutations.DELETE_REGION, mutationOptions);
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

    const addRegion = async () => {
		let list = activeRegion;
		const newRegion = {
			_id: '',
			name: 'No Name',
			capital: 'No capital',
			leader: 'No One',
			landmarks: ["No landmarks"]
		};
		 let regionID = newRegion._id;
		// let listID = activeRegion._id;
        console.log("regionid is "+regionID);
        // $_id: String!, $index: Int!
        const { data } = await AddRegion({ variables: { region: newRegion, _id: activeRegionID, index: index}});
        setIndex(index+1);	
	};

    const editRegion = async (regionId, field, value, prev) => {
        const { data } = await UpdateRegion({ variables: { _id: activeRegionID, regionId: regionId, field: field, value: value}});
		// let transaction = new EditItem_Transaction(listID, itemID, field, prev, value, flag, UpdateRegion);
		// props.tps.addTransaction(transaction);
		// tpsRedo();
	};

    const deleteRegion = async (regionId, region) => {
        console.log("reached deleteregion");
        const { data } = await DeleteRegion({ variables: { regionId: regionId, _id: activeRegionID}});
    }

    let tempID = 0;
    return (
        <WLayout wLayout="header-lside">
            <WLHeader>
                <WNavbar className="welcome-navbar">
                    <ul>
                        <WNavItem onClick={() => history.push("/maps")} style={{cursor:"pointer"}}>
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
              
              <WRow style= {{fontSize: "25px", paddingLeft: "246px", paddingTop: "60px"}}>
                <WCol size="2">
                        <i className="material-icons" onClick={addRegion} style={{color: "green"}} >add</i>
                </WCol>
                <WCol size="2"></WCol>
                
                <WCol> Region:</WCol>
                <WCol size= "2">{" "+activeRegion.name}</WCol>
              </WRow>
            }
            </WLHeader>
            <WCard wLayout="header-content-footer" style={{ width: "1025px", height: "550px", position: "fixed", left: "16%", top: "20%"}} raised className="example-layout-labels">
                <WCHeader style={{ backgroundColor: "red", color: "white"}}>
                    <WRow style={{paddingTop:"20px"}}>
                        <WCol size="1" style={{textAlign:"center"}}></WCol>
                        <WCol size="2" style={{textAlign:"center"}}>Name</WCol>
                        <WCol size="2" style={{textAlign:"center"}}>Capital</WCol>
                        <WCol size="2"style={{textAlign:"center"}}>Leader</WCol>
                        <WCol size="2"style={{textAlign:"center"}}>Flag</WCol>
                        <WCol size="3"style={{textAlign:"center"}}>Landmarks</WCol>
                    </WRow>
                </WCHeader>
                <WCContent style={{ backgroundColor: "grey", overflowY: "auto" }}>
                  <RegionList activeList={activeRegion} editRegion={editRegion} deleteRegion={deleteRegion} />
                </WCContent>
                <WCFooter style={{ backgroundColor: "grey" }}>
               
                </WCFooter>
            </WCard>

            {
				showUpdate && (<UpdateAccount fetchUser={props.fetchUser} user={props.user}setShowUpdate={setShowUpdate} />)
			}

        </WLayout>
    );
};

export default Region;
