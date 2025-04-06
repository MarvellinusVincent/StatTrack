# 🎧 Stat Spot  

**Stat Spot** is a sleek web application that lets users track and analyze their Spotify listening habits. Dive deep into your top artists, tracks, and genres across different time ranges — and discover insights about your unique musical taste.

> While we await Spotify quota extension approval, feel free to preview the app with the following test credentials:  
> **Email:** stattracktest@gmail.com  
> **Password:** stattrack123  

---

## ✨ Features  
- 🎵 View your **Top Artists**, **Top Tracks**, and **Top Genres**  
- 📈 Analyze your **listening trends** across multiple time periods  
- 🔐 **Secure Spotify login** using OAuth authentication  
- 📱 **Responsive UI** optimized for desktop and mobile  

---

## ⚙️ Prerequisites  
Before running the app locally, ensure the following are installed:

- [Node.js](https://nodejs.org/) (Latest LTS version recommended)  
- [Git](https://git-scm.com/)  
- A [Spotify Developer Account](https://developer.spotify.com/) with an application set up  

---

## 🚀 Getting Started  

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/yourusername/stat-spot.git
   cd stat-spot
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```

3. **Create a Spotify App**  
   - Log in at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
   - Create a new app to get your **Client ID** and **Client Secret**

4. **Set Up Environment Variables**  
   - Create a `.env` file in the root directory  
   - Add the following variables:
     ```env
     CLIENT_ID=your_spotify_client_id
     CLIENT_SECRET=your_spotify_client_secret
     REDIRECT_URI=http://localhost:8888/callback
     FRONTEND_URI=http://localhost:3000
     ```

5. **Start the Development Server**  
   ```bash
   npm start
   ```

6. **Open the App**  
   Navigate to:  
   [http://localhost:3000](http://localhost:3000)

---

## 🧑‍💻 Usage  

1. **Log in** with your Spotify account  
2. **Authorize** the app to access your listening data  
3. Explore your **music stats** and uncover your listening patterns!  

---

## 🚢 Deployment  

To deploy Stat Spot, run the build command and follow deployment steps for your preferred platform (e.g., Vercel, Netlify, Firebase):  

```bash
npm run build
```

Upload the build folder or link the repo depending on your platform’s requirements.

---

## 🤝 Contributing  

We welcome contributions!  
Feel free to fork the project and submit a pull request with improvements or new features.  

---

## 📄 License  

Stat Spot is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).  

---

## 📬 Contact  

For questions, suggestions, or feedback:  
📧 vmarvellinus@gmail.com  
📂 Or open an issue on the GitHub repository  
