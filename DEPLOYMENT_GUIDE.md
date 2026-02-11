# Deployment Guide for Prescripto

This guide will walk you through deploying your **Node.js Backend** to [Render](https://render.com) and your **React Frontend** to [Vercel](https://vercel.com).

## Prerequisites

1.  **GitHub Repository**: Ensure your project is pushed to a GitHub repository.
2.  **Environment Variables**: You will need the values from your local `.env` file.

---

## Part 1: Deploy Backend to Render

1.  **Create a New Web Service**:
    *   Go to your [Render Dashboard](https://dashboard.render.com/).
    *   Click **New +** and select **Web Service**.
    *   Connect your GitHub repository.

2.  **Configure Service**:
    *   **Name**: `prescripto-backend` (or any unique name).
    *   **Region**: Choose the one closest to your potential users (e.g., Singapore, Frankfurt).
    *   **Branch**: `main` (or your default branch).
    *   **Root Directory**: In the "Root Directory" field, enter `backend`. **(Important!)**
    *   **Runtime**: `Node`.
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`

3.  **Environment Variables**:
    *   Scroll down to the **Environment Variables** section.
    *   Add the keys and values. Refer to `backend/.env.example` for the list.
        *   `MONGODB_URI`: Your MongoDB connection string.
        *   `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY`: Your Cloudinary credentials.
        *   `JWT_SECRET`: A strong secret key.
        *   `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`: Your Razorpay credentials.
        *   `CURRENCY`: `INR`
        *   `NODE_ENV`: `production`

4.  **Deploy**:
    *   Click **Create Web Service**.
    *   Wait for the deployment to finish. You should see "Your service is live".
    *   **Copy the URL** provided by Render (e.g., `https://prescripto-backend.onrender.com`). You will need this for the frontend.

---

## Part 2: Deploy Frontend to Vercel

1.  **Create a New Project**:
    *   Go to your [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **Add New...** -> **Project**.
    *   Import your GitHub repository.

2.  **Configure Project**:
    *   **Framework Preset**: Select **Vite**.
    *   **Root Directory**: Click "Edit" and select `frontend`. **(Important!)**

3.  **Environment Variables**:
    *   Expand the **Environment Variables** section.
    *   Add the following variable:
        *   **Name**: `VITE_BACKEND_URL`
        *   **Value**: Paste the Render Backend URL you copied earlier without the trailing slash (e.g., `https://prescripto-backend.onrender.com`).

4.  **Deploy**:
    *   Click **Deploy**.
    *   Vercel will build and deploy your site.
    *   Once complete, you will get a live URL for your frontend!

---

## Part 3: Final Verification

1.  Open your deployed frontend URL.
2.  Try to **create an account** or **login**.
3.  Check if the data loads (doctors list, etc.).
4.  If something isn't working:
    *   **Backend Logs**: Check the "Logs" tab in your Render dashboard to see if the server started correctly or if there are database connection errors.
    *   **Frontend Logs**: Check the browser developer console (F12) for any network errors or CORS issues.
