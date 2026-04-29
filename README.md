# JustBidIt – Online Auction System

Welcome to **JustBidIt**! This guide will help you get the project up and running on your local machine.

---

## Prerequisites

Make sure you have the following installed before getting started:

- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js & npm](https://nodejs.org/)
- [VS Code](https://code.visualstudio.com/)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
- [Git](https://git-scm.com/)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/shouvikseth/Online-Bidding-system
```

---

### 2. Set Up the Backend (Flask)

#### Create & Activate a Virtual Environment

```bash
cd server
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

#### Install Backend Dependencies

```bash
pip install -r requirements.txt
```

#### Configure Database Connection

Open `server.py` and update the database URI with your MySQL credentials:

```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:YOUR_PASSWORD@localhost:3306/bid_me'
```

> ⚠️ **Important:** If your password contains special characters (e.g. `@`), URL-encode them.  
> For example, `my@pass` becomes `my%40pass` in the connection string.

---

### 3. Set Up the Database (MySQL)

- Open **MySQL Workbench** and connect to your local server
- Run the following SQL to create the database and tables:

```sql
CREATE DATABASE just_bid_it;
USE just_bid_it;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> You can also import the provided `schema.sql` file if available.

---

### 4. Run the Flask Server

```bash
cd server
python server.py
```

The backend will run on: [http://localhost:8000](http://localhost:8000)

---

### 5. Set Up the Frontend (React)

Open a new terminal and navigate to the frontend folder:

```bash
cd client
npm install
npm start
```

The frontend will run on: [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
JustBidIt/
├── server/
│   ├── server.py          # Main Flask app
│   ├── auth.py            # Authentication routes
│   ├── products.py        # Product/auction routes
│   ├── bids.py            # Bidding routes
│   ├── admin.py           # Admin panel routes
│   ├── notifications.py   # Notification system
│   ├── requirements.txt   # Python dependencies
│   └── uploads/           # Uploaded product images
├── client/
│   ├── src/               # React source files
│   ├── public/
│   └── package.json
└── README.md
```

---

## Test Credentials (Optional)

If the database has been seeded with test data:

```
Email:    test@example.com
Password: test123
```

---

## Contributing

- Always pull the latest changes from `main` before starting work
- Create a new branch for each feature:
  ```bash
  git checkout -b feature/your-feature-name
  ```
- Open a Pull Request via GitHub and assign a reviewer
- **Never push directly to `main`**

---

## Common Issues

| Problem | Fix |
|---|---|
| `Unknown MySQL server host` error | Special character in password — URL-encode it (e.g. `@` → `%40`) |
| MySQL won't connect | Make sure the MySQL service is running (`net start MySQL80` on Windows) |
| Port 8000 already in use | Kill the process using the port or change the port in `server.py` |
| `npm start` fails | Run `npm install` first to install all dependencies |

---

## License

This project is for educational purposes.
