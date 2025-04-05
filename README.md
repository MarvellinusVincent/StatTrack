# Stat Spot  
Stat Spot is a web application that allows users to track and analyze their Spotify listening habits. Users can view their top artists, tracks, and genres over different time periods, and gain insights into their music preferences. 

While awaiting spotify quuota extension request to be approved, you can check out what it looks like with this email and password!
Email: stattracktest@gmail.com
Password: stattrack123

## Features  
- View top artists, tracks, and genres  
- Analyze listening trends over time  
- User authentication via Spotify API  
- Responsive and intuitive UI  

## Prerequisites  
Before running Stat Spot on your local machine, ensure you have the following installed:  
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)  
- [Git](https://git-scm.com/)  
- A Spotify Developer Account with API credentials  

## Installation  
1. Clone the repository:  
   `git clone https://github.com/yourusername/stat-spot.git && cd stat-spot`  
2. Install dependencies:  
   `npm install`
3. Create a user in spotify developer and create an app as well
4. Set up environment variables:  
   - Create a `.env` file in the root directory  
   - Add the following variables (Client ID and Client Secret can be obtained in the spotify for developers setting:
      `CLIENT_ID=your id`
      `CLIENT_SECRET=your secret`
      `REDIRECT_URI=http://localhost:8888/callback`
      `FRONTEND_URI=http://localhost:3000`
5. Run the development server:  
   `npm start`  
6. Open your browser and go to:  
   `http://localhost:3000`  

## Usage  
1. Log in using your Spotify account.  
2. Grant the necessary permissions to access your listening data.  
3. Explore your listening statistics!  

## Deployment  
To deploy the app, use a hosting service like Vercel, Netlify, or Firebase:  
`npm run build`  
Then, follow the deployment instructions for your chosen platform.  

## Contributing  
Contributions are welcome! Feel free to fork the repository and submit pull requests.  

## License  
This project is licensed under the MIT License.  

## Contact  
For any issues or suggestions, reach out via GitHub Issues or email at vmarvellinus@gmail.com.  

