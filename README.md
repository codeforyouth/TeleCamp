# TeleCamp

バーチャルオフィス・バーチャルカンファレンスシステム

## Docker setup

1. Get Docker Desktop for Mac (https://hub.docker.com/editions/community/docker-ce-desktop-mac/)
2. Install docker-compose by command: `sudo pip install -U docker-compose`.
3. Edit & Run `sh setup.sh`
4. Run docker-compose `docker-compose up`  
   development: line 16 --> `npm run start-dev`  
   production:  line 16 --> `npm start`
