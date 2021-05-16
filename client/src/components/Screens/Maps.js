import Logo 							from '../navbar/Logo';
import UpdateAccount 							from '../modals/UpdateAccount';
import MapName 							from '../modals/MapName';
import MapList                      from '../maplist/MapList';
import * as mutations 					from '../../cache/mutations';
import { GET_DB_MAPS } 				from '../../cache/queries';
import React, { useState } 				from 'react';
import { LOGOUT }                           from '../../cache/mutations';
import { useMutation, useQuery, useApolloClient } 		from '@apollo/client';
import { WNavbar, WNavItem, WButton, WCard, WCContent, WCFooter, WCHeader, WInput, WRow, WCol } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { useHistory } from "react-router-dom";

const Maps = (props) => {
    const history = useHistory();
    const auth = props.user === null ? false : true;
    let maps = [];
    let MapData = [];

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);

	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data) { 
		// Assign todolists 
		for(let map of data.getAllMaps) {
			maps.push(map)
		}
		//create data for sidebar links
		for(let map of maps) {
			if(map) {
				MapData.push({_id: map._id, name: map.name});
			}	
		}
	}

    const mutationOptions = {
		refetchQueries: [{ query: GET_DB_MAPS }], 
		awaitRefetchQueries: true,
		// onCompleted: () => reloadList()
	}

    const [showUpdate, toggleShowUpdate] 	= useState(false);
    const [showMapName, toggleShowMapName] 	= useState(false);
    const [mapID, setMapID]                 = useState(0);


    const client = useApolloClient();

	const [Logout] = useMutation(LOGOUT);
    const [AddMap] = useMutation(mutations.ADD_MAP);
    const [UpdateMapField] 	= useMutation(mutations.UPDATE_MAP_FIELD, mutationOptions);
    const [DeleteMap] 	= useMutation(mutations.DELETE_MAP);


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
        toggleShowMapName(false);
	};

    const setShowMapName = () => {
		toggleShowUpdate(false);
        toggleShowMapName(!showMapName);
	};

    const updateListField = async (_id, field, value, prev) => {
		const { data } = await UpdateMapField({ variables: { _id: _id, field: field, value: value }});
        return data;
    	};

    const createNewMap = async (name) =>{
        let list = {
			_id: Number.toString(mapID),
			name: name,
			owner: props.user._id,
			regions: [],
            sortRule: 'name',
			sortDirection: 1
		}
        setMapID(mapID+1);
		const { data } = await AddMap({ variables: { map: list }, refetchQueries: [{ query: GET_DB_MAPS }] });
        if(data){
            history.push(`region/${data.addMap._id}`);	
        }
    }

    const deleteMap = async (_id) =>{
        DeleteMap({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_MAPS }] });
    }

    let tempID = 0;
    return (
        <WLayout wLayout="header-lside">
            <WLHeader>
                <WNavbar className="welcome-navbar">
                    <ul>
                        <WNavItem>
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
            <WCard wLayout="header-content-footer" style={{ width: "375px", height: "400px", position: "fixed", left: "36%", top: "25%"}} raised className="example-layout-labels">
                <WCHeader style={{ backgroundColor: "red", color: "white", textAlign: "center" }}><p></p>Your Maps</WCHeader>
                <WCContent style={{ backgroundColor: "lightpink", overflowY: "auto" }}>
                    <p></p>
                    <MapList listIDs={MapData} updateListField={updateListField} tempid={tempID++} key={tempID} handleDeleteMap={deleteMap}
                />
                </WCContent>
                <WCFooter style={{ backgroundColor: "black" }}>
                <WButton className="card-button" style={{ backgroundColor: "darkred" }} onClick={setShowMapName} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
					Add New Map
				</WButton>
                </WCFooter>
            </WCard>
            {
				showUpdate && (<UpdateAccount fetchUser={props.fetchUser} user={props.user} setShowUpdate={setShowUpdate} />)
			}

            {
				showMapName && (<MapName fetchUser={props.fetchUser} createNewMap={createNewMap} setShowMapName={setShowMapName} />)
			}

        </WLayout>
    );
};
export default Maps;
