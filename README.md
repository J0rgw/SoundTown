# SoundTown

SoundTown is a web-based application designed to provide an engaging and interactive experience for music enthusiasts. Basically a fancy frontend project to try the spotify API done un december of 2024, also mainly because I want to test the new scroll snap types :) .

## Features

- **Interactive Charts**: Visualize music data with interactive charts.
- **Search Functionality**: Quickly find your favorite music, artists, or albums.
- **Custom Fonts**: Beautiful typography using custom fonts like FreeFat and WorkSans.
- **Responsive Design**: Optimized for various devices and screen sizes.
- **Rich Media Assets**: Includes high-quality images and icons for a visually appealing experience.

## Live Demo

Check out the live version of the app here: [SoundTown](https://soundtownmusic.netlify.app/)

## App Overview

SoundTown is structured as a single-page application with 5 scroll-snap sections:

1. **Landing Page**: The introductory section that welcomes users to the app.
2. **Discover Weekly**: The section dedicated to show new discoveries of albums based on your fave artists, genres and albums.
3. **New Releases**: The section dedicated to show new releases based on your fave genres.
4. **Monthly Stats**: The section dedicated to show monthly resume of your top 5 listened albums.
5. **Yearly Stats**: The section dedicated to show yearly resume of your top 5 listened albums.

## Technology Stack

SoundTown leverages the following technologies:

- **CSS**: For styling and creating a visually appealing user interface.
- **JavaScript (JS)**: For adding interactivity and dynamic behavior to the app.
- **jQuery**: Simplifies DOM manipulation and enhances JavaScript functionality.
- **Netlify**: Used for hosting the live version of the app.

## Project Structure

The project is organized as follows:

```
SoundTown/
├── bibliografia.txt
├── index.html
├── assets/
│   ├── chart-js-SentJSON_imageData.png
│   ├── rissotto.json
│   ├── stat/
│   └── EH-0001 Airpod Max Style Headphones/
│       ├── EH-0001 Airpod Max Style Headphones 1.jpg
│       ├── EH-0001 Airpod Max Style Headphones 2.jpg
│       └── EH-0001 Airpod Max Style Headphones 3.jpg
├── css/
│   ├── cardStyles.css
│   ├── reset.css
│   ├── scroll.css
│   ├── search.css
│   └── styleP.css
├── fonts/
│   ├── freefat/
│   │   ├── free_fat_font.zip
│   │   ├── readme.txt
│   │   ├── OTF/
│   │   └── WEB/
│   └── worksanshangloves/
│       ├── worksans.zip
│       └── worksans/
│           ├── OFL.txt
│           ├── README.txt
│           └── static/
├── html/
│   └── search.html
├── img/
│   ├── EH-0001_Airpod_Max_Style_Headphones_1-removebg-preview (1).png
│   ├── EH-0001_Airpod_Max_Style_Headphones_2-removebg-preview.png
│   ├── magnifier.svg
│   ├── magnifierSelected.svg
│   ├── person-fill.svg
│   ├── person.svg
│   ├── spotify-icon.svg
│   ├── vinyl-fill.svg
│   └── vinyl-fillSelected.svg
├── js/
│   ├── card.js
│   ├── nav.js
│   ├── piano.js
│   ├── search.js
│   ├── spotify.js
│   └── topartists.json
```

## Getting Started

### Prerequisites

To run this project locally, you need:

- A modern web browser (e.g., Chrome, Firefox, Edge).
- A local web server (optional, for advanced features).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/SoundTown.git
   ```
2. Navigate to the project directory:
   ```bash
   cd SoundTown
   ```
3. Open `index.html` in your browser to explore the app.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- Icons and images are sourced from various free and open resources.
- Fonts are provided by their respective creators.

---

Enjoy exploring SoundTown!
