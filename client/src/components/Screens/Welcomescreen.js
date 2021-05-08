import Logo 							from '../navbar/Logo';
import Login 							from '../modals/Login';
import CreateAccount 					from '../modals/CreateAccount';
import NavbarOptions 					from '../navbar/NavbarOptions';
import * as mutations 				from '../../cache/mutations';
import { GET_DB_MAPS } 				from '../../cache/queries';
import React, { useState } 				from 'react';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem, WButton } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';

const Welcomescreen = (props) => {

    const auth = props.user === null ? false : true;
    let maps = [];

    const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);

	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }

    const mutationOptions = {
		refetchQueries: [{ query: GET_DB_MAPS }], 
		awaitRefetchQueries: true,
		//onCompleted: () => reloadList()
	}

    const setShowLogin = () => {
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
	};

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
                            <WButton className="navbar-options" onClick={setShowCreate} wType="texted" > 
                                Create Account 
                            </WButton>
                        </WNavItem>
                        <WNavItem hoverAnimation="lighten">
                            <WButton className="navbar-options" style={{color:"white"}} onClick={setShowLogin} wType="texted" hoverAnimation="text-primary">
                                Login
                            </WButton>
                        </WNavItem>
                    </ul>
                </WNavbar>
            </WLHeader>

            <WLMain style={{color:"white", fontSize:"70px", paddingTop: "160px"}}>
                <p></p>
                Welcome to the World Data Mapper
            </WLMain>
            {
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} reloadMaps={refetch}setShowLogin={setShowLogin} />)
			}
        </WLayout>
    );
};

export default Welcomescreen;

 {/* <NavbarOptions
                            fetchUser={props.fetchUser} auth={auth}
                            setShowCreate={setShowCreate} 	setShowLogin={setShowLogin}
							reloadMaps={refetch} 
                        />    		 */}