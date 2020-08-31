import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {apiKey} from '../../apiKey.json';

const containerStyle = {
	width: '100%',
	height: '400px'
};

const MyProfileMap = ({lat, lon, setLat, setLon}) => {
	const [mapCentre, setMapCentre] = useState({lat: 0, lng: 0});

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		setMapCentre({lat: parseFloat(lat), lng: parseFloat(lon)});
	}, [lat, lon]);

	const dragEndHandler = (event) => {
		setLat(event.latLng.lat());
		setLon(event.latLng.lng());
	};

	return (
		<LoadScript
			googleMapsApiKey={apiKey}
		>
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={mapCentre}
				zoom={6}
			>
				<Marker
					draggable={true}
					position={mapCentre}
					onDragEnd={event => dragEndHandler(event)}
				/>
			</GoogleMap>
		</LoadScript>
	)
};

export default MyProfileMap;
