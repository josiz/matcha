import React, {useState, useEffect} from 'react';

import Rcslider, {Range} from 'rc-slider';
import 'rc-slider/assets/index.css';

const Filters = ({distance, setDistance,
	minAge, setMinAge, maxAge, setMaxAge,
	minCommonTags, setMinCommonTags,
	sort, setSort, sortingMethods,
	tagSearch, setTagSearch,
	minFame, setMinFame, maxFame, setMaxFame}) => {

	const [tagSearchInput, setTagSearchInput] = useState('');
	const [distanceDisplay, setDistanceDisplay] = useState(distance);
	const [minFameDisplay, setMinFameDisplay] = useState(minFame);
	const [maxFameDisplay, setMaxFameDisplay] = useState(maxFame);

	useEffect(() => {
	if (minFame > 999)
		setMinFameDisplay('infinity');
	if (maxFame > 999)
		setMaxFameDisplay('infinity');
	}, []);

	const eventHandler = (event, setFunction) => {
		setFunction(event.target.value);
	};

	const rangeEventHandler = (values, setMin, setMax) => {
		setMin(values[0]);
		setMax(values[1]);
	};

	const distanceHandler = (value, setDistance) => {
		setDistance(value);
		setDistanceDisplay(value);
		if (value === 501) {
			setDistance(99999);
			setDistanceDisplay('500+');
		}
	};

	const fameHandler = (values, setMin, setMax) => {
		const min = values[0] === 1000 ? 99999999 : values[0];
		const max = values[1] === 1000 ? 99999999 : values[1];
		setMin(min);
		setMax(max);
		setMinFameDisplay(min);
		setMaxFameDisplay(max);
		if (min > 999)
			setMinFameDisplay('infinity');
		if (max > 999)
			setMaxFameDisplay('infinity');
	}

	const tagEventHandler = (event, setTagSearchInput) => {
		setTagSearchInput(event.target.value.replace(/[#+]/g, ''));
	};

	const sortingMethodOptions = sortingMethods.map((method, index) => {
		return (
			<option value={index} key={method.name}>{method.display}</option>
		);
	});

	const filterWindow =
	{
		padding: '15px'
	}

	return (
		<div style={filterWindow}>
			<div>
				<label htmlFor='sort'>Sort by:</label>
				<select className="custom-select" name='sort' value={sort} onChange={event => setSort(event.target.value)}>
					{sortingMethodOptions}
				</select>
			</div><br />
			<label htmlFor='distance'>Maximum distance: {distanceDisplay} km</label>
			<Rcslider
				step={1}
				value={distance}
				min={0}
				max={501}
				onChange={value => distanceHandler(value, setDistance)}
			/> <br />
			{/* <input type='range' name='distance' value={distance} max='9000' onChange={event => eventHandler(event, setDistance)} /> */}

			<div>Age range: {minAge} - {maxAge}</div>
			<Range
				step={1}
				value={[minAge, maxAge]}
				min={16}
				max={99}
				onChange={values => rangeEventHandler(values, setMinAge, setMaxAge)}
			/> <br />
			{/* <div>
				<label htmlFor='minAge'>Minimum age</label>
				<input type='number' name='minAge' value={minAge} min='16' onChange={event => eventHandler(event, setMinAge)} />
			</div>
			<div>
				<label htmlFor='minAge'>Maximum age</label>
				<input type='number' name='maxAge' value={maxAge} max='99' onChange={event => eventHandler(event, setMaxAge)} />
			</div> */}
			<div>Fame range: {minFameDisplay} - {maxFameDisplay}</div>
			<Range
				step={1}
				value={[minFame, maxFame]}
				min={0}
				max={1000}
				onChange={values => fameHandler(values, setMinFame, setMaxFame)}
			/> <br />
			<div>
				<label htmlFor='minCommonTags'>Minimum common tags</label>
				<select className="form-control" type='number' name='minCommonTags' value={minCommonTags} onChange={event => eventHandler(event, setMinCommonTags)}>
					<option>0</option>
					<option>1</option>
					<option>2</option>
					<option>3</option>
					<option>4</option>
					<option>5</option>
				</select>
			</div> <br />
			{/* <div>
				<label htmlFor='tagSearch'>Tag search</label>
				<input type='text' name='tagSearch' value={tagSearchInput} onChange={event => eventHandler(event, setTagSearchInput)} />
				<button onClick={() => setTagSearch(tagSearchInput)}>Search</button>
				<button onClick={() => {setTagSearch(''); setTagSearchInput('');}}>Reset</button>
			</div> */}
			
			<label htmlFor='tagSearch'>Tag search</label>
			<div className="input-group">
	
				<input type="text" className="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1" name='tagSearch' value={'#' + tagSearchInput} onChange={event => tagEventHandler(event, setTagSearchInput)} />
				<div className="input-group-append">
					<button className="btn btn-primary" type="button" onClick={() => setTagSearch(tagSearchInput)}>Search</button>
				</div>
				<div className="input-group-append">
					<button className="btn btn-danger" type="button" onClick={() => {setTagSearch(''); setTagSearchInput('');}}>Reset</button>
				</div>
			</div>
		</div>
	);
};

export default Filters;
