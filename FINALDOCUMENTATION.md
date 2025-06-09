# Multi-Cloud Architecture: Vercel + Render + AWS S3 + MongoDB Atlas

## 📌 Objective
Design and deploy a multi-cloud architecture in which services are distributed across two or more cloud providers, demonstrating interoperability between platforms.

---

## 🌐 Architecture Overview

- **Frontend**: Hosted on [Vercel](https://vercel.com)
- **Backend/API**: Hosted on [Render](https://render.com)
- **Database**: Managed via [MongoDB Atlas](https://cloud.mongodb.com)
- **Static Assets**: Stored in [AWS S3](https://aws.amazon.com/s3)

### 🔁 Interoperability Flow
1. Frontend (Vercel) calls REST API from Backend (Render)
2. Backend fetches data from MongoDB Atlas
3. Backend or Frontend loads static image assets from AWS S3

---

## ☁️ Cloud Components

### ✅ Vercel (Frontend Hosting)
- Framework: React / Next.js / HTML-CSS-JS
- Deployment Source: GitHub
- URL: `https://read-gro-fm6j.vercel.app/`

📸 Screenshot:
![image](https://github.com/user-attachments/assets/9381c42f-d4fd-4a13-91ee-204e284bb93d)

---

### ✅ Render (Backend Hosting)
- Stack: Node.js / Express
- API Endpoint: `https://ct-multicloud-t4.onrender.com`

📸 Screenshot:
![Screenshot 2025-06-09 093056](https://github.com/user-attachments/assets/d6e53a31-a3d3-41c3-a0a7-77a4805f9089)
![Screenshot 2025-06-09 093139](https://github.com/user-attachments/assets/8cb77722-dd7b-401d-a272-5facc06fb208)

---

### ✅ MongoDB Atlas (Database)
- Cluster Name: `Cluster1Compass`
- Database: `music`
- Collection: `users`, `playlists`,`songs`
- URL-mongodb+srv://user1:********@cluster1compass.dxrppaw.mongodb.net/Music

📸 Screenshot:

![image](https://github.com/user-attachments/assets/9cc5cdc8-0945-4426-a30a-82e5e71a4dc2)

---

### ✅ AWS S3 (Asset Storage)
- Bucket Name: `readgrobucketforimages`
- Public Image URL: `https://readgrobucketforimages.s3.us-east-1.amazonaws.com/1747381943151.jpg`

  📸 Screenshot:
![image](https://github.com/user-attachments/assets/bb20d514-63bc-4cbb-bb9d-83de8fed0729)
![image](https://github.com/user-attachments/assets/6647bd9e-5fd4-4d0e-b88d-f9b08daf40a6)



## 🔗 Integration Flow Diagram
![04cfff9e-54f4-4cdc-b07a-160b5d5b27ba](https://github.com/user-attachments/assets/c10060fb-6dbc-42d2-94a4-c65b4f86d265)

## 🔄 Workflow Description

1. **Frontend (Vercel)**  
   - User accesses the frontend application hosted on Vercel.
   - The frontend is built using React or Next.js.

2. **Backend API (Render)**  
   - Frontend sends API requests (e.g., form submission, login) to backend.
   - The backend runs an Express/Node.js server deployed on Render.

3. **Image Handling (AWS S3)**  
   - Backend receives image/file upload requests and stores them in an AWS S3 bucket.
   - The public S3 URL is returned and used on the frontend.

4. **Database (MongoDB Atlas)**  
   - Backend stores and retrieves data (users, posts, metadata) from MongoDB Atlas.
   - MongoDB Atlas ensures secure, scalable NoSQL storage in the cloud.

---

## ✅ Benefits of This Architecture

- 🧩 **Modular & Decoupled**: Easier to scale individual components
- 🌍 **Global Delivery**: Frontend via Vercel CDN, low-latency backend APIs
- ☁️ **Best-of-Breed Services**: Each cloud excels in its domain (hosting, database, storage)
- 🔒 **Secure & Scalable**: Managed DB and file hosting with fine-grained access control

