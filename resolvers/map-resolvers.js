const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');
//const Sorting = require('../utils/sorting')

module.exports = {
    Query: {
        getAllMaps: async (_, __, { req }) => {
            const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const maps = await Map.find({owner: _id}).sort({updatedAt: 'descending'});
			if(maps) {
				return (maps);
			} 
        
        },

        // getMapById: async (_, args) => {
        //     const { _id } = args;
		// 	const objectId = new ObjectId(_id);
		// 	const map = await Map.findOne({_id: objectId});
		// 	if(map) return map;
		// 	else return ({});
        // },
    },
    Mutation: {
        addRegion: async(_, args) => {
            const { _id, region , index} = args;
			const listId = new ObjectId(_id);
			const objectId = new ObjectId();
			const found = await Map.findOne({_id: listId});
			if(!found) return ('Map not found');
			if(region._id === '') region._id = objectId;
			let listRegions = found.regions;
			if(index < 0) listRegions.push(region);
			else listRegions.splice(index, 0, region);
			
			const updated = await Map.updateOne({_id: listId}, { regions: listRegions });

			if(updated) return (region._id)
			else return ('Could not add region');
        },
        addMap: async (_, args) => {
            const { map } = args;
			const objectId = new ObjectId();
			const { id, name, owner, regions} = map;
			const newList = new Map({
				_id: objectId,
				name: name,
				owner: owner,
				regions: regions,
			});
			const updated = await newList.save();
			if(updated) {
				console.log(newList)
				return newList;
			}
        },
        deleteRegion: async (_, args) => {
			const  { _id, regionId } = args;
			const listId = new ObjectId(_id);
			const found = await Map.findOne({_id: listId});
			let listRegions = found.regions;
			listRegions = listRegions.filter(region => region._id.toString() !== regionId);
			const updated = await Map.updateOne({_id: listId}, { reigons: listRegions })
			if(updated) return (listRegions);
			else return (found.regions);

		},
        deleteMap: async(_, args) => {
            const { _id } = args;
			const objectId = new ObjectId(_id);
			const deleted = await Map.deleteOne({_id: objectId});
			if(deleted) return true;
			else return false;
        },
        updateMapField: async (_, args) => {
            const { field, value, _id } = args;
			const objectId = new ObjectId(_id);
			const updated = await Map.updateOne({_id: objectId}, {[field]: value});
			if(updated) return value;
			else return "";
        },
        updateRegionField: async (_, args) => {
            const { _id, regionId, field} = args;
			let { value } = args
			const listId = new ObjectId(_id);
			const found = await Map.findOne({_id: listId});
			let listRegions = found.regions;
			// if(flag === 1) {
			// 	if(value === 'complete') { value = true; }
			// 	if(value === 'incomplete') { value = false; }
			// }
			listRegions.map(region => {
				if(region._id.toString() === regionId) {	
					region[field] = value;
				}
			});
			const updated = await Map.updateOne({_id: listId}, { region: listRegions })
			if(updated) return (listRegions);
			else return (found.regions);
        }

    }
}