import ColorThief from 'colorthief';

// example from: https://stackoverflow.com/questions/56181633/using-color-thief-library-in-react-doesnt-work
export const getColors = async (url, count, quality = 10, crossOrigin = "Anonymous") => {
    if (!url) {
        return Promise.reject(new Error("Invalid URL"));
    }

	return new Promise((resolve, reject) => {
        const img = new Image();

		img.onload = () => {
			try{
				const colorThief = new ColorThief();
				const palette = colorThief.getPalette(img, count, quality);
				resolve(palette);

			} catch(err) {
				reject(err);
			}
		};

		img.src = url;
		img.crossOrigin  = crossOrigin;
	});
};

