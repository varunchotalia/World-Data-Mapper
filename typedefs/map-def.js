const { gql } = require('apollo-server');
// getMapByid(_id: String!): Map
const typeDefs = gql `
        type Map {
            _id: String!
            name: String!
            owner: String!
            regions: [Region]
            sortRule: String
		    sortDirection: Int
        }
        type Region {
            _id: String!
            name: String!
            capital: String!
            leader: String!
            landmarks: [[String!]]!
            parent: String!
        }
        extend type Query {
            getAllMaps: [Map]
        }
        extend type Mutation {
            addRegion(region: RegionInput!, _id: String!, index: Int!): String
            addMap(map: MapInput!): Map
            deleteRegion(regionId: String!, _id: String!): [Region]
            deleteMap(_id: String!): Boolean
            updateMapField(_id: String!, field:String!, value:String!): String
            updateRegionField( _id: String!, regionId: String!, field: String!, value: String!): [Region]
            sortRegions(_id: String!, criteria: String!): [Region]
            addLandmark(_id: String!, regionId: String!, value: [[String!]]!): [Region]
            deleteLandmark(_id: String!, regionId: String!, name: String!): [Region]
        }
        input FieldInput {
            _id: String
            field: String
            value: String
        }
        input MapInput {
            _id: String
            name: String
            owner: String
            regions: [RegionInput]
            sortRule: String
		    sortDirection: Int
        }
        input RegionInput {
            _id: String
            name: String
            capital: String
            leader: String
            landmarks: [[String]]
            parent: String
        }
`;

module.exports = { typeDefs: typeDefs }