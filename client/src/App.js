import React 			from 'react';
import Welcomescreen    from './components/Screens/Welcomescreen';
import Maps             from './components/Screens/Maps';
import Region             from './components/Screens/Region';
import Subregion             from './components/Screens/Subregion';
import RegionViewer             from './components/Screens/RegionViewer';
import { useQuery } 	from '@apollo/client';
import * as queries 	from './cache/queries';
import { jsTPS } 		from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
 
const App = () => {
	let user = null;
    let transactionStack = new jsTPS();
	let refreshTps = false;
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);

    if(error) { console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { user = getCurrentUser; }
    }
	return(
		<BrowserRouter>
			<Switch>
				<Redirect exact from="/" to={ {pathname: "/welcome"} } />
				<Route exact
					path="/welcome"  
					name="welcome" 
					// component={(props) => 
					// 	<Welcomescreen tps={transactionStack} fetchUser={refetch} user={user} refreshTps={refreshTps}/>
					// } 
					render={() => 
						<Welcomescreen tps={transactionStack} fetchUser={refetch} user={user} refreshTps={refreshTps}/>
					} 
				/>
                   {/* <Welcomescreen tps={transactionStack} fetchUser={refetch} user={user} refreshTps={refreshTps}/> */}
				<Route/>
			</Switch>
            <Switch>
            <Route 
                    exact
					path="/maps"
					name="maps" 
					// component={(props) => 
					// 	<Maps tps={transactionStack} fetchUser={refetch} user={user} refreshTps={refreshTps}/>
					// } 
					render={() => 
						<Maps tps={transactionStack} fetchUser={refetch} user={user} refreshTps={refreshTps}/>
					} 
				/>
				<Route/>
            </Switch>
            <Switch>
            <Route 
                    exact
					path="/region/:id"
					name="region" 
					// component={(props) => 
					// 	<Region tps={transactionStack} fetchUser={refetch} user={user} refreshTps={refreshTps}/>
					// } 
					render={() => 
						<Region tps={transactionStack} fetchUser={refetch} user={user} refreshTps={refreshTps}/>
					} 
				/>
				<Route/>
            </Switch>
            <Switch>
            <Route 
                    exact
					path="/subregionview/:id"
					name="subregionview" 
					render={() => 
						<RegionViewer tps={transactionStack} fetchUser={refetch} user={user} refreshTps={refreshTps}/>
					} 
				/>
				<Route/>
            </Switch>
			<Switch>
			<Route 
                    
					path="/subregion/:id"
					name="subregion"
					// component={(props) => 
					// 	<Subregion tps={transactionStack} fetchUser={refetch} user={user} refreshTps={refreshTps}/>
					// }  
					render={() => 
						<Subregion tps={transactionStack} fetchUser={refetch} user={user} refreshTps={refreshTps}/>
					} 
				/>
				<Route/>
            </Switch>
		</BrowserRouter>
	);
}

export default App;