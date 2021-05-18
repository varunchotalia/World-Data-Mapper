const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');
const Sorting = require('../utils/sorting');
const Parents = require('../utils/parents');

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
            const { _id, region, index} = args;
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
			const { id, name, owner, regions, sortRule, sortDirection} = map;
			const newList = new Map({
				_id: objectId,
				name: name,
				owner: owner,
				regions: regions,
				sortRule: sortRule,
				sortDirection: sortDirection,
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
			const updated = await Map.updateOne({_id: listId}, { regions: listRegions })
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
			let { value } = args;
			const listId = new ObjectId(_id);
			const found = await Map.findOne({_id: listId});
			let listRegions = found.regions;
			listRegions.map(region => {
				if(region._id.toString() === regionId) {	
					region[field] = value;
				}
			});
		//	console.log(listRegions);
			const updated = await Map.updateOne({_id: listId}, { regions: listRegions });
			if(updated){
			 return (listRegions);
			}
			else{
				 return (found.regions);
			}
        },
		addLandmark: async (_, args) => {
			const {_id, regionId} = args;
			let {value} = args; 
			const listId = new ObjectId(_id);
			const found = await Map.findOne({_id: listId});
			let listRegions = found.regions;
			let tempRegion = listRegions.filter(region => region._id.toString() === regionId)[0];
			let tempList = [];
			let newValue = [value[0][0], value[1][0]];
			tempList.push(Parents.findAncestors(listRegions, _id, tempRegion, tempList));
			let list = tempList;
			if(list!={}){
				for(let i=0; i<list.length;i++){
					listRegions.map(region => {
						let temp = JSON.parse(JSON.stringify(region.landmarks));
						temp.push(newValue);
						if(region._id.toString() === list[i]) {	
							region.landmarks = temp;
						}
					});
				}
			}
			listRegions.map(region => {
				let temp = JSON.parse(JSON.stringify(region.landmarks));
				temp.push(newValue);
				if(region._id.toString() === regionId) {	
					region.landmarks = temp;
				}
			});
			const updated = await Map.updateOne({_id: listId}, { regions: listRegions });
			if(updated){
			 return (listRegions);
			}
			else{
				 return (found.regions);
			} 
		},
		deleteLandmark: async(_, args) =>{
			const {_id, regionId, name} = args;
			const listId = new ObjectId(_id);
			const found = await Map.findOne({_id: listId});
			let listRegions = found.regions;
			listRegions.map(region => {
				let temp = JSON.parse(JSON.stringify(region.landmarks));
				console.log("temp",temp[0][1]);
			//	temp.filter((a, b) => landmark[0] !== name);
				for(let i=0; i<temp.length;i++){
					if(temp[i][0] == name){
						temp.splice(i, 1);
					}
				}
				console.log("posttemp",temp);
				if(region._id.toString() === regionId) {	
					region.landmarks = temp;
				}
			});
			const updated = await Map.updateOne({_id: listId}, { regions: listRegions });
			if(updated){
			 return (listRegions);
			}
			else{
				 return (found.regions);
			} 
		},
		sortRegions: async (_, args) => {
			const { _id, criteria } = args;
			const listId = new ObjectId(_id);
			const found = await Map.findOne({_id: listId});
			let newDirection = found.sortDirection === 1 ? -1 : 1; 
			console.log(newDirection, found.sortDirection);
			let sortedRegions;

			switch(criteria) {
				case 'name':
					sortedRegions = Sorting.byName(found.regions, newDirection);
					break;
				case 'leader':
					sortedRegions = Sorting.byLeader(found.regions, newDirection);
					break;
				case 'capital':
					sortedRegions = Sorting.byCapital(found.regions, newDirection);
					break;
				default:
					return found.regions;
			}
			const updated = await Map.updateOne({_id: listId}, { regions: sortedRegions, sortRule: criteria, sortDirection: newDirection })
			if(updated) return (sortedRegions);

		}
    }
}