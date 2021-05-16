const byName = (regions, direction) => {
	if(direction === 1) regions.sort((a,b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
	else regions.sort((a,b) => a.name.toUpperCase() < b.name.toUpperCase() ? 1 : -1);
	return regions;
}

const byCapital = (regions, direction) => {
	if(direction === 1) regions.sort((a,b) => a.capital.toUpperCase() > b.capital.toUpperCase() ? 1 : -1);
	else regions.sort((a,b) => a.capital.toUpperCase() < b.capital.toUpperCase() ? 1 : -1);
	return regions;
}

const byLeader = (regions, direction) => {
	if(direction === 1) regions.sort((a,b) => a.leader.toUpperCase() > b.leader.toUpperCase() ? 1 : -1);
	else regions.sort((a,b) => a.leader.toUpperCase() < b.leader.toUpperCase() ? 1 : -1);
	return regions;
}

module.exports = {byName, byCapital, byLeader}