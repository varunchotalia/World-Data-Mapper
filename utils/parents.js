const findAncestors = (regionList, _id, region, list) => {
    if(region.parent !== _id){
        console.log()
        let newRegion = regionList.filter(tempregion => tempregion._id.toString() === region.parent)[0];
        console.log("newRegion", newRegion);
        list.push(region.parent);
        console.log("list", list);
        findAncestors(regionList, _id, newRegion, list);
    }
    else{
        console.log("returnlist", list);
        return list;
    }
}

module.exports = {findAncestors}
// function recursiveAddLandmark(name, parentId, mapCopy){
//     if(parentId !== activeMap._id){
//         let region = mapCopy.regions.filter(region => region._id === parentId)[0];
//         region.landmarks.push([name, activeRegionID]);
//         recursiveAddLandmark(name, region.parent);
//     }
//     else{
//         return;
//     }
// }