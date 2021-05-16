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

const RegionViewer = (props) =>{
    const history = useHistory();
    const location = useLocation()
    const auth = props.user === null ? false : true;

    const mutationOptions = {
		refetchQueries: [{ query: GET_DB_MAPS }], 
		awaitRefetchQueries: true,
		//onCompleted: () => reloadList()
	}

    const [showUpdate, toggleShowUpdate] 	= useState(false);

    const client = useApolloClient();

	const [Logout] = useMutation(LOGOUT);

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

    console.log("the value is "+ location.state.data);

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
           
            <WCard wLayout="header-content" style={{ width: "375px", height: "700px" }} raised className="example-layout-labels">
        <WCHeader style={{ backgroundColor: "red", color: "white" }}>Region Information</WCHeader>
        <WCContent style={{ backgroundColor: "grey" }}>
        <WRow style={{paddingTop:"10px", color: "white"}}>
                <WCol size="7">
                Region Name:  {location.state.data.name}
                </WCol>
            </WRow>
            <WRow style={{paddingTop:"20px", color: "white"}}>
                <WCol size="4" onClick={() => history.goBack()}>
                Parent Region: 
                </WCol>
                <WCol size="4" onClick={() => history.goBack()} style={{color: "blue"}}>
                    {location.state.name}
                </WCol>
            </WRow>
            <WRow style={{paddingTop:"20px", color: "white"}}>
                <WCol size="7">
                Region Capital: {location.state.data.capital}
                </WCol>
            </WRow>
            <WRow style={{paddingTop:"20px", color: "white"}}>
                <WCol size="7">
                Region Leader: {location.state.data.leader}
                </WCol>
            </WRow>
            <WRow style={{paddingTop:"20px", color: "white"}}>
                <WCol size="7">
                Number of Sub-regions: 0
                </WCol>
            </WRow>
        </WCContent>
      </WCard>
      <WRow >
          <WCol size="1" style={{paddingTop:"20px", color: "white", paddingTop: "10px", paddingLeft: "350px"}}>  Region Landmarks:</WCol>
            </WRow>
            {
				showUpdate && (<UpdateAccount fetchUser={props.fetchUser} user={props.user} setShowUpdate={setShowUpdate} />)
			}
        </WLayout>
    );
};

export default RegionViewer;