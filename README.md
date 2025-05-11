# MyGarage - A Simple Car Tracker
MyGarage is a clean and minimal web app I built to keep track of the cars. It lets me add details like the make, model, year, mileage, fuel type, VIN number, and more. If anything changes like mileage or service date; I can update it. And when I no longer need a car in the list, I can easily delete it.

What makes it more fun (and useful) is the Scan VIN feature. Instead of typing out the full 17-character VIN, I can just click a button, open my camera, and it reads the VIN directly from the image using Google Vision OCR. It’s quick, accurate, and saves time.

The app is built using Node.js, Express, and a lightweight file-based database (NeDB). It also uses WebSockets to sync changes across tabs or devices in real time so if I update something on my phone, it instantly updates on my laptop too. The frontend is built with vanilla JavaScript and Tailwind CSS for a simple but sharp retro look.

# How to Run It
Clone the repo

Run npm install

Add your Google Vision API key JSON file, and set the GOOGLE_APPLICATION_CREDENTIALS environment variable to point to it

Run node server.js

Open http://localhost:5000/ in your browser

# Demo Video
https://share.vidyard.com/watch/uGwbakMHYySYprS6KE7THq
