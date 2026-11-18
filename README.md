# HabitCode – Smart Habit Tracker

#### Video Demo: [https://youtu.be/V5nDvXE3zrg]

#### Live Application: https://habit-tracker6.onrender.com/

#### GitHub Repository: https://github.com/nishagour125-png/habit-tracker

## Description

HabitCode is a web-based habit tracking application designed to help users build consistent daily routines, monitor their progress, and understand their personal habits. The main purpose of this project is to make habit tracking simple, organized, and engaging.

Users can track daily activities such as studying, coding, waking up early, self-care, healthy eating, and reducing screen time. Instead of relying on memory, users can use the application to record their daily progress and review their consistency over time.

The application provides multiple views to organize habit-related information. Its dashboard gives users an overview of their activities, while the history, calendar, and statistics sections help them understand their progress.

## Features

### 1. Dashboard
The dashboard is the main interface of the application. It provides an overview of the user's habit-tracking activity.

### 2. My Habits
The My Habits section provides an interface for managing personal habits. The application includes a habit modal for habit-related interactions.

### 3. Calendar and Heatmap
The heatmap provides a visual way to explore habit activity across dates.

### 4. History
The History section allows users to review their recorded habit activity.

### 5. Statistics
The Statistics section presents habit-related information and visual analytics.

### 6. Achievements
The application includes an achievement system. Newly unlocked achievements can trigger notifications, sound effects, and confetti animations.

### 7. Settings
The Settings section provides an interface for application preferences.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES Modules)
- Vite
- CSS animations
- JavaScript-based data management and visualization

## Project Structure

- `index.html`: Main HTML entry point.
- `src/main.js`: Initializes the application, navigation, views, and event listeners.
- `src/components/`: Contains dashboard, navigation, habit, history, heatmap, statistics, achievements, and settings components.
- `src/core/`: Contains habit-related logic, date utilities, analytics, achievements, streak calculations, default habits, and the application store.
- `src/styles/`: Contains layout, component, heatmap, animation, reset, and CSS variable styles.
- `src/utils/`: Contains audio, chart, and confetti utilities.
- `package.json`: Project dependencies and scripts.
- `vite.config.js`: Vite configuration.

## Installation and Setup

1. Install Node.js and npm.
2. Clone the repository:

   `git clone https://github.com/nishagour125-png/habit-tracker.git`

3. Enter the project directory:

   `cd habit-tracker`

4. Install dependencies:

   `npm install`

5. Start the development server using the script configured in `package.json`:

   `npm run dev`

6. Open the local URL displayed in the terminal.

## Application Architecture

The application uses a component-based JavaScript structure. The main application class initializes individual views and the navigation component. Users can switch between views, and the URL hash is used to represent the active section.

The application store provides a central point for data updates. When the store publishes an update, the active view is rendered again to reflect the latest information.

The styling is separated into different CSS files to keep the interface organized. Utility modules handle supporting features such as audio, charts, and confetti effects.

## Design Decisions

The project separates its interface into individual components instead of placing all functionality in one large JavaScript file. This makes the code easier to organize and maintain.

A separate core directory keeps application logic apart from visual components. CSS files are also divided according to their responsibilities, making the interface easier to update.

The dashboard and additional views provide different ways to explore habit information without overcrowding a single screen.

## Purpose and Learning Outcomes

This project demonstrates the use of JavaScript modules, event handling, component-based application structure, DOM manipulation, CSS organization, and frontend application development.

Developing HabitCode provided an opportunity to practice organizing a multi-feature web application and creating an interface focused on everyday productivity.

## AI Assistance Acknowledgement

ChatGPT was used to assist with organizing and drafting project documentation and preparing the presentation outline. The project source code and implementation should be accurately attributed to the people who created them. Any additional AI-assisted code must be acknowledged in the relevant code comments.
