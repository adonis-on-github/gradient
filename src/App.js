import {useState, useEffect} from 'react';
import { getColors2 } from './getColors.js';

import './App.css';

const rgb2hex = value => value.reduce((result, crt) => result += crt.toString(16), "#");

const Palette = props => {
	const {url} = props;
	const [colors, setColors] = useState(null);
	const [error, setError] = useState(false);


	useEffect(() => {
		const load = async () => {
			try {
				const result = await getColors2(url, 10);
				setColors(result);
			} catch(error) {
				setError(error.message);
			}
		};

		load();
	}, [url]);

	const renderColors = () => (
		colors && <div className="colors">
			{colors.map((crt, index) => (
				<div
					className="color"
					key={index}
					style={{backgroundColor: rgb2hex(crt)
					}}></div>
			))}
		</div>
	);

	return (
		<div className="palette">
			<h2>{url}</h2>
			<img
				src={url}
				alt="demo"
				height="300"
				/>

				{error ? <div>{error}</div>: null}
				{!error ? renderColors(): null}
		</div>
	)
};

function App() {

	return (
		<div className = "App" >
			<Palette
				url="https://images.unsplash.com/photo-1516876437184-593fda40c7ce" />

			<Palette
				url="https://topinterns.saleem.dev/images/music-categories/2.png" />

			<Palette
				url="/2.png" />
		</div>
	);
}

export default App;