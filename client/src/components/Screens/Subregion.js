// import Logo 							from '../navbar/Logo';
// import UpdateAccount 							from '../modals/UpdateAccount';
// import * as mutations 					from '../../cache/mutations';
// import { GET_DB_MAPS } 				from '../../cache/queries';
// import RegionList                      from '../regionlist/RegionList';
// import React, { useState } 				from 'react';
// import { LOGOUT }                           from '../../cache/mutations';
// import { useMutation, useQuery, useApolloClient } 		from '@apollo/client';
// import { WNavbar, WNavItem, WButton, WCard, WCContent, WCFooter, WCHeader, WInput, WRow, WCol } 	from 'wt-frontend';
// import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
// import { useHistory, useParams } from "react-router-dom";
// import WMMain from 'wt-frontend/build/components/wmodal/WMMain';


// const Subregion = (props) => {
//     const history = useHistory();
//     const auth = props.user === null ? false : true;
//     // let maps = [];
//     // let MapData = [];
//     let { id } = useParams();
    

//     const reloadList = async() =>{
//         let tempID = activeRegionID;
// 		let list = maps.find(list => list._id === tempID);
// 		activeRegion = (list);
//     }

//     const mutationOptions = {
// 		refetchQueries: [{ query: GET_DB_MAPS }], 
// 		awaitRefetchQueries: true,
// 		//onCompleted: () => reloadList()
// 	}

//     // console.log(activeRegion);

//     const [showUpdate, toggleShowUpdate] 	= useState(false);

//     const client = useApolloClient();

// 	const [Logout] = useMutation(LOGOUT);

//     const [AddRegion] 			= useMutation(mutations.ADD_REGION, mutationOptions);

//     const handleLogout = async (e) => {
//         Logout();
//         const { data } = await props.fetchUser();
//         if (data) {
//             let reset = await client.resetStore();
//         }
//         history.push("/welcome");
//     };

//     const setShowUpdate = () => {
// 		toggleShowUpdate(!showUpdate);
// 	};

//     const addRegion = async () => {
// 		let list = activeRegion;
// 		const newRegion = {
// 			_id: '',
// 			name: 'No Name',
// 			capital: 'No capital',
// 			leader: 'No One',
// 			landmarks: ["No landmarks"]
// 		};
// 		 let regionID = newRegion._id;
// 		// let listID = activeRegion._id;
//         console.log("regionid is "+regionID);
//         // $_id: String!, $index: Int!
//         const { data } = await AddRegion({ variables: { region: newRegion, _id: activeRegionID, index: index}});
//         setIndex(index+1);	
// 	};

//     let tempID = 0;
//     return (
//         <WLayout wLayout="header-lside">
//             <WLHeader>
//                 <WNavbar className="welcome-navbar">
//                     <ul>
//                         <WNavItem onClick={() => history.push("/maps")}>
//                             <Logo className='logo' />
//                         </WNavItem>
//                     </ul>
//                     <ul>
//                         <WNavItem hoverAnimation="lighten">
//                             <WButton className="navbar-options"  onClick={setShowUpdate} wType="texted" > 
//                                  {auth?props.user.name:"Loading"}
//                             </WButton>
//                         </WNavItem>
//                         <WNavItem hoverAnimation="lighten">
//                             <WButton className="navbar-options" onClick={handleLogout} style={{color:"white"}}  wType="texted" hoverAnimation="text-primary">
//                                 Logout
//                             </WButton>
//                         </WNavItem>
//                     </ul>
//                 </WNavbar>
//             {    
//               activeRegion &&  
              
//               <WRow style= {{fontSize: "25px", paddingLeft: "246px", paddingTop: "60px"}}>
//                 <WCol size="2">
//                         <i className="material-icons" onClick={addRegion} style={{color: "green"}} >add</i>
//                 </WCol>
//                 <WCol size="2"></WCol>
                
//                 <WCol> Region:</WCol>
//                 <WCol size= "2">{" "+activeRegion.name}</WCol>
//               </WRow>
//             }
//             </WLHeader>
//             <WCard wLayout="header-content-footer" style={{ width: "1025px", height: "550px", position: "fixed", left: "16%", top: "20%"}} raised className="example-layout-labels">
//                 <WCHeader style={{ backgroundColor: "red", color: "white"}}>
//                     <WRow style={{paddingTop:"20px"}}>
//                         <WCol size="2" style={{textAlign:"center"}}>Name</WCol>
//                         <WCol size="3" style={{textAlign:"center"}}>Capital</WCol>
//                         <WCol size="2"style={{textAlign:"center"}}>Leader</WCol>
//                         <WCol size="2"style={{textAlign:"center"}}>Flag</WCol>
//                         <WCol size="3"style={{textAlign:"center"}}>Landmarks</WCol>
//                     </WRow>
//                 </WCHeader>
//                 <WCContent style={{ backgroundColor: "grey", overflowY: "auto" }}>
//                   <RegionList activeList={activeRegion} />
//                 </WCContent>
//                 <WCFooter style={{ backgroundColor: "grey" }}>
               
//                 </WCFooter>
//             </WCard>

//             {
// 				showUpdate && (<UpdateAccount fetchUser={props.fetchUser} user={props.user}setShowUpdate={setShowUpdate} />)
// 			}

//         </WLayout>
//     );
// };

// export default Subregion;
