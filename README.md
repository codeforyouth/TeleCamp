# TeleCamp

バーチャルオフィス・バーチャルカンファレンスシステム

## Setup
- Edit `setup.sh` for HOST
```
$ sh setup.sh
$ docker-compose up
```
- open http://localhost:8080/

### Docker環境がローカルにない場合
1. Get Docker Desktop for Mac (https://hub.docker.com/editions/community/docker-ce-desktop-mac/)
2. Install docker-compose by command: `sudo pip install -U docker-compose`.

## nginx-proxy について

現状（2020.04.23時点）では、nginx-proxy を使ってドメイン解決やってます。
ローカルでやるときはこの設定をオフにする必要があるかも。

https://github.com/nginx-proxy/nginx-proxy
