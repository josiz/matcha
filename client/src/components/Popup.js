import React from 'react';

export const Popup = ({children, setPopupState}) => {
	const backGround =
	{
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		position: 'fixed',
		top: '0',
		left: '0',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: '22',
	}
	const box =
	{
		display: 'inline-block',
		width: 'fit-content',
		height: 'fit-content',
		maxHeight: '93%',
		maxWidth: '85%',
		backgroundColor: 'white',
		position: 'fixed',
		borderRadius: '10px',
		padding: '20px',
		textAlign: 'center',
		top: '50%',
		left: '45%',
		transform: 'translate(-50%, -50%)',
		zIndex: '998'
	};

	const closeButton =
	{
		height: '27px',
		width: '27px',
		position: 'absolute',
		top: '-15px',
		right: '-15px',
		backgroundColor: 'white',
		borderRadius: '15px',
		border: '1px solid gray',
		boxShadow: '6px 6px 29px -1px rgba(0, 0, 0, 1)',
		cursor: 'pointer',
		zIndex: '999'
	}

	const button = 
	{
		
	}

	return (
		<>
			<div style={backGround}>
				<div style={box}>
					{children}
					<button onClick={() => {setPopupState(false)}} style={closeButton}>X</button>
				</div>
			</div>
		</>
	);
};
// position: 'absolute',
// 		top: '100px',
// 		left: '100px',
// 		zIndex: '9',
// 		backgroundColor: 'white',
// 		border: '1px solid black',
// 		padding: '1em'
