import './css/style.scss';
import './css/layout.scss';
import React 	from 'react';
import ReactDOM from 'react-dom';
import App 		from './App';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
const cache = new InMemoryCache({

	/*
		The cache object ids are generated using the objectID(a string) instead
		of the number id so that objects are refered to consistently across the
		client and server
	*/
	dataIdFromObject: object => `${object.__typename}:${object._id}`,
	typePolicies: {
		Map: {
			fields: {
				regions: {
                    landmarks: {
					    merge(existing, incoming){
						    return incoming
					    }
                    },
				},
			},
		},
		Query: {
			fields: {
				getAllMaps: {
					merge(existing, incoming){
						return incoming
					}
				}
			}
		}
	},
});

// bad hardcoding, localhost port should match port in the backend's .env file
const BACKEND_LOCATION = 'http://localhost:4000/graphql';

const client = new ApolloClient({
	uri: BACKEND_LOCATION,
	connectToDevTools: true,
	// Credentials: include is necessary to pass along the auth cookies with each server request
	credentials: 'include',
	cache: cache,
});





ReactDOM.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
	    	<App />
		</ApolloProvider>
  	</React.StrictMode>,
  	document.getElementById('root')
);