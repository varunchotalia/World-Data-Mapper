import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			name
			password
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $name: String!) {
		register(email: $email, password: $password, name: $name) {
			email
			password
			name
		}
	}
`;
//    update(oldEmail: String!, newEmail: String!, password: String!, name: String!): Boolean!
export const UPDATE = gql`
mutation Update($_id: String!, $oldEmail: String!, $email: String!, $password: String!, $name: String!) {
    update(_id: $_id, oldEmail: $oldEmail, email: $email, password: $password, name: $name) {
        _id
        email
        password
        name
    }
}
`;

export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

export const ADD_REGION = gql`
	mutation AddRegion($region: RegionInput!, $_id: String!, $index: Int!) {
		addRegion(region: $region, _id: $_id, index: $index)
	}
`;

export const DELETE_REGION = gql`
	mutation DeleteRegion($regionId: String!, $_id: String!) {
		deleteRegion(regionId: $regionId, _id: $_id) {
			_id
			name
			leader
			capital
			landmarks
			parent
		}
	}
`;

export const UPDATE_REGION_FIELD = gql`
	mutation UpdateRegionField($_id: String!, $regionId: String!, $field: String!, $value: String!) {
		updateRegionField(_id: $_id, regionId: $regionId, field: $field, value: $value) {
			_id
			name
			leader
			capital
			landmarks
			parent
		}
	}
`;

export const ADD_LANDMARK = gql`
	mutation AddLandmark($_id: String!, $regionId: String!, $value: [[String!]]!) {
		addLandmark(_id: $_id, regionId: $regionId, value: $value) {
			_id
			name
			leader
			capital
			landmarks
			parent
		}
	}
`;

export const ADD_MAP = gql`
	mutation AddMap($map: MapInput!) {
		addMap(map: $map) {
			_id
			name
			owner
			regions {
				_id
			    name
			    leader
		    	capital
			    landmarks 
				parent
			}
			sortRule
			sortDirection
		}
	}
`;

export const DELETE_MAP = gql`
	mutation DeleteMap($_id: String!) {
		deleteMap(_id: $_id)
	}
`;

export const UPDATE_MAP_FIELD = gql`
	mutation UpdateMapField($_id: String!, $field: String!, $value: String!) {
		updateMapField(_id: $_id, field: $field, value: $value)
	}
`;

export const SORT_REGIONS = gql`
	mutation SortRegions($_id: String!, $criteria: String!) {
		sortRegions(_id: $_id, criteria: $criteria) {
			_id
			name
			capital
			leader
			landmarks
			parent
		}
	}
`;

