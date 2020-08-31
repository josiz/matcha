import React, {useState} from 'react';
import {Button} from 'react-bootstrap';

const SingleTag = ({tag, index, tagRemoval}) => {
	return (
		<div style={{display: 'block', marginRight: '0.5em', marginLeft: '0.5em'}}>
			<Button style={{backgroundColor: index % 2 ? 'gainsboro' : 'darkgray', color: 'black', borderColor: index % 2 ? 'darkgray' : 'gainsboro'}}>#{tag}</Button>
			<Button variant="danger" id={'tagRemovalId' + index} onClick={event => tagRemoval(event)}>X</Button> 
		</div>
	);
};


const TagsInput = ({tags, setTags}) => {
	const [newTag, setNewTag] = useState('');

	const tagRemoval = event => {
		setTags(tags.filter((tag, index) => (event.target.id !== 'tagRemovalId' + index)));
	};

	const singleTags = tags.map((tag, index) =>
		<SingleTag tag={tag} index={index} tagRemoval={tagRemoval} key={tag + index} />
	);

	return (
		<>
			<div style={{display: 'flex', flexFlow: 'row wrap'}}>
				{singleTags}
			</div>
			<br />
			<div className="input-group" style={{marginTop: '0.5em'}}>
  				<span style={{position: 'relative', left: '20px'}}>#</span>
				<input pattern=".{1,200}" type="text" className="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1" value={'#' + newTag} onChange={event => setNewTag(event.target.value.replace(/[#+]/g, ''))} />
				<div className="input-group-append">
					<button className="btn btn-success" type="button" onClick={() => {if (newTag.length > 1 && newTag.length < 200) {setTags([...tags, newTag]); setNewTag('');}}}>Add!</button>
				</div>
			</div>
			<br />
		</>
	);
};

export default TagsInput;
