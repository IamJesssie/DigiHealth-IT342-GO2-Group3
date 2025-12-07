<<<<<<< HEAD
# DigiHealth: Digital Clinic & Appointment Booking System

## Short Description
MVP version of a digital clinic management system that enables patients to book appointments via mobile app and allows clinic staff to manage appointments and patient records through a web dashboard.

## Tech Stack Used
- **Backend**: Spring Boot 2.7+, MySQL 8.0+, Google OAuth 2.0
- **Web Frontend**: React 18+, Tailwind CSS, Chart.js
- **Mobile**: Kotlin for Android
- **Database**: MySQL
- **Hosting**: Railway/Heroku (Free Tier)

## Setup & Run Instructions

### Prerequisites

#### System Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Memory**: Minimum 8GB RAM (16GB recommended)
- **Storage**: At least 10GB free space
- **Internet**: Stable connection for downloading dependencies

#### Software Requirements
- **Java Development Kit (JDK)**: OpenJDK 17 or Oracle JDK 17
- **Node.js**: Version 18.17.0 or higher (LTS recommended)
- **npm**: Version 8.15.0 or higher (comes with Node.js)
- **MySQL**: Version 8.0 or higher
- **MySQL Workbench** (optional): For database management
- **Android Studio**: Arctic Fox (2020.3.1) or higher
- **Git**: Version 2.34.0 or higher

#### Mobile Development Additional Requirements
- **Android SDK**: API level 21 (Android 5.0) or higher
- **Android Emulator** or **Physical Android Device** (API level 21+)

### Environment Configuration

#### Database Setup
1. **Install MySQL Server**:
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install mysql-server

   # macOS (using Homebrew)
   brew install mysql

   # Windows: Download from https://dev.mysql.com/downloads/mysql/
   ```

2. **Start MySQL Service**:
   ```bash
   # Ubuntu/Debian
   sudo systemctl start mysql
   sudo systemctl enable mysql

   # macOS
   brew services start mysql

   # Windows: Start MySQL from Services
   ```

3. **Create Database**:
   ```sql
   CREATE DATABASE digihealth_db;
   CREATE USER 'digihealth_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON digihealth_db.* TO 'digihealth_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

#### Environment Variables
Create `.env` files in respective directories:

**Backend (.env)**:
```properties
DB_HOST=localhost
DB_PORT=3306
DB_NAME=digihealth_db
DB_USERNAME=digihealth_user
DB_PASSWORD=your_secure_password

JWT_SECRET=your-256-bit-secret
JWT_EXPIRATION=86400

GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

SERVER_PORT=8080
```

**Web Frontend (.env)**:
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

### Backend Setup (Spring Boot)

#### 1. Pre-installation
- Verify Java installation: `java -version` (should show JDK 17+)
- Verify Maven installation: `mvn -version` (if not installed, install Maven 3.8+)

#### 2. Setup Instructions
```bash
# 1. Clone repository (if not already done)
git clone <repository-url>
cd DigiHealth-IT342-GO2-Group3

# 2. Navigate to backend directory
cd backend

# 3. Configure database connection
# Edit src/main/resources/application.properties
# Update database credentials as per your setup

# 4. Install dependencies
mvn clean install

# 5. Run database migrations (if using Flyway/Liquibase)
mvn flyway:migrate

# 6. Start the application
mvn spring-boot:run
```

#### 3. Verify Backend Installation
- Application should start on `http://localhost:8080`
- Check logs for any errors
- API documentation available at `http://localhost:8080/swagger-ui.html` (if enabled)

#### 4. Common Issues & Solutions
- **Port 8080 already in use**: Change port in `application.properties`
- **Database connection failed**: Verify MySQL is running and credentials are correct
- **Maven build failed**: Ensure JDK 17+ is installed and JAVA_HOME is set

### Web Dashboard Setup (React)

#### 1. Pre-installation
- Verify Node.js installation: `node -v` (should show v18.17.0+)
- Verify npm installation: `npm -v` (should show 8.15.0+)

#### 2. Setup Instructions
```bash
# 1. Navigate to web directory
cd web

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env file with your configuration

# 4. Start development server
npm start
or
.\start-app.bat
```

#### 3. Verify Web Installation
- Application should open at `http://localhost:3000`
- Check browser console for any errors
- Ensure backend is running for full functionality

#### 4. Available Scripts
```bash
npm start      # Start development server
npm run build  # Create production build
npm test       # Run tests
npm run eject  # Eject from Create React App (irreversible)
```

#### 5. Common Issues & Solutions
- **Port 3000 already in use**: Change PORT in .env file
- **Module not found**: Run `npm install` again
- **CORS errors**: Ensure backend allows requests from localhost:3000

### Mobile App Setup (Android Kotlin)

#### 1. Pre-installation
- Install Android Studio Arctic Fox or higher
- Ensure Android SDK API 21+ is installed
- Set up Android emulator or connect physical device

#### 2. Setup Instructions
1. **Open Project in Android Studio**:
   - Launch Android Studio
   - Select "Open" and navigate to `mobile/` directory
   - Wait for Gradle sync to complete

2. **Configure API Endpoints**:
   - Open `app/build.gradle` or configuration files
   - Update base URL to match your backend deployment
   - Example: `BASE_URL = "http://10.0.2.2:8080/api"` (for emulator)

3. **Build and Run**:
   ```bash
   # In Android Studio terminal
   ./gradlew build
   ./gradlew installDebug
   ```

4. **Run on Device/Emulator**:
   - Click "Run" button in Android Studio
   - Select target device/emulator
   - Wait for installation and launch

#### 3. Verify Mobile Installation
- App should launch on device/emulator
- Check logs in Android Studio for any errors
- Test basic functionality like login/registration

#### 4. Common Issues & Solutions
- **Gradle sync failed**: Update Gradle version in `gradle/wrapper/gradle-wrapper.properties`
- **Emulator not connecting**: Use `10.0.2.2` as localhost for emulator
- **Build fails**: Clean project and rebuild (`Build > Clean Project`)

### Development Workflow

#### Running All Components Together
1. **Start Database**: Ensure MySQL is running
2. **Start Backend**: `cd backend && mvn spring-boot:run`
3. **Start Web**: `cd web && npm start` (in new terminal)
4. **Start Mobile**: Use Android Studio to run mobile app

#### Testing the Integration
1. **Backend Health Check**: `curl http://localhost:8080/actuator/health`
2. **Database Connection**: Check if backend logs show successful DB connection
3. **Frontend-Backend**: Open web app and verify API calls work
4. **Mobile-Backend**: Test mobile app API integration

#### Debugging Tips
- **Backend**: Check application logs in terminal/IDE
- **Frontend**: Use React DevTools and browser console
- **Mobile**: Use Android Studio's Logcat for debugging
- **Database**: Use MySQL Workbench to inspect data

### Production Deployment (Future Reference)

#### Backend Deployment
- Build JAR: `mvn clean package`
- Deploy to server with Java 17+
- Configure production database

#### Web Deployment
- Build: `npm run build`
- Serve using Nginx or Apache
- Configure environment variables

#### Mobile Deployment
- Generate signed APK/AAB
- Configure production API endpoints

## Team Members
- **Jessie Noel Lapure** - Project Manager / Full Stack Developer - jessienoel.lapure@cit.edu | [Iamjesssie](https://github.com/IamJesssie)
- **William Bustamante** - Full Stack Developer- william.bustamante@cit.edu | [yamn24](https://github.com/yamn24)
- **Joel Verano** - Full Stack Developer- joel.verano@cit.edu | [shinjii](https://github.com/Veranojoel)
- **Matthew Rimar Martus** - Full Stack Developer - matthewrimar.martus@cit.edu | [Mr-cmd-pip](https://github.com/Mr-cmd-pip)

## Deployed Link
[Will be added after deployment]
=======
# DigiHealth-IT342-GO2-Group3
MVP version of a digital clinic management system that enables patients to book appointments via mobile app and allows clinic staff to manage appointments and patient records through a web dashboard.
>>>>>>> 28530b2cc228c45ea07583ff95ec69e945a97672
