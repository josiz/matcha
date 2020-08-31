import React from 'react';

const Suggestions = ({users, distanceFilter, minAge, maxAge, minCommonTags,
	sort, tagSearch, minFame, maxFame}) => {

	if (!users.length)
		return <div>There are currently no suggestions available for you!</div>;

	const userCards = users.filter(element => {
		if (element.props.profile.distance > distanceFilter)
			return false;
		if (element.props.profile.age < minAge)
			return false;
		if (element.props.profile.age > maxAge)
			return false;
		if (element.props.profile.commonTags < minCommonTags)
			return false;
		if (element.props.profile.fame < minFame)
			return false;
		if (element.props.profile.fame > maxFame)
			return false;
		
		// This filter must be just before the final `return true;`
		// as it can also return true
		if (tagSearch.length)
			return element.props.profile.tags.includes(tagSearch);
		return true;
	});

	if (!userCards.length)
		return (<div>There are some profiles available for you, but the current filters are too strict!</div>);

	return userCards.sort((a, b) => {
			return (a.props.profile[sort.key] - b.props.profile[sort.key]) * sort.order;
	});
};

export default Suggestions;
