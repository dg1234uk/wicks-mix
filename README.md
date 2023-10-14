# Wicks Mix

Wicks Mix is a handy web application designed to simplify your grocery shopping experience when using Joe Wick's Body Coach app. It takes the hassle out of managing multiple shopping lists by seamlessly combining two lists into one comprehensive list.

## Features

- **Combine Shopping Lists:** Easily merge two separate shopping lists into one.
- **Clipboard Functionality:** With a single click, copy the combined list to your clipboard.
- **Ingredient Parsing:** The app automatically recognizes quantities, units, and names of ingredients.
- **Recipe Aggregation:** If your lists include recipes, Wicks Mix compiles them in a neat section for your convenience.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js and npm](https://nodejs.org/).

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/wicks-mix.git
   ```
2. Navigate to the repository directory:
   ```
   cd wicks-mix
   ```
3. Install the required packages and dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Open your browser and visit `http://localhost:3000`.

### Usage

1. Copy and paste your first shopping list from Joe Wick's Body Coach app into the `List 1` text area.
2. Repeat the process for your second shopping list in the `List 2` text area.
3. Click the `Submit` button to combine your lists.
4. Your combined shopping list will appear below. Click the `Copy` button to copy the list to your clipboard.

## How It Works

Wicks Mix utilizes regular expressions to parse ingredient lines, identifying and extracting quantities, units, and ingredient names. Ingredients from both lists are then aggregated, combining quantities where necessary. If recipes are present, the application will also aggregate them, summing up the counts of identical recipes.

The application is built using [Remix](https://remix.run/), which provides the benefits of fast navigation, instantaneous feedback, and server rendering, enhancing both the developer and user experience.

## Contributing

I welcome your contributions. Please fork the repository and make changes as you'd like. Pull requests are warmly welcome.

1. Fork the repo on GitHub.
2. Clone the project to your own machine.
3. Commit changes to your own branch.
4. Push your work back up to your fork.
5. Submit a Pull Request so that we can review your changes.

## Acknowledgements

- [Joe Wicks](https://www.thebodycoach.com), for the inspiration from his Body Coach app.
- [Remix](https://remix.run/) for their wonderful framework that made this project possible.
