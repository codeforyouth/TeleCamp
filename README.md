# TeleCamp（てれキャン）

withコロナ時代を共に生き抜くためのバーチャルオフィス・バーチャルカンファレンスシステム「TeleCamp（てれキャン）」

## Setup
1. Edit `setup.sh` for HOST

    ```
    $ sh setup.sh
    $ docker-compose up
    ```
2. Open browser (http://localhost:8080/)
    
    ```
    $ open http://localhost:8080/
    ```


### Docker環境がローカルにない場合（Mac）
1. Get Docker Desktop for Mac (https://hub.docker.com/editions/community/docker-ce-desktop-mac/)
2. Install docker-compose by command: `sudo pip install -U docker-compose`.


## レイアウト
部屋のレイアウトデータは、Google SpreadSheet で作成可能です。  

https://drive.google.com/open?id=13unkBri3d6gXs1zbgglELgG50HspY4oZlyUanZlhRLQ


## nginx-proxy について
現状（2020.04.23時点）では、nginx-proxy を使ってドメイン解決やってます。
ローカルでやるときはこの設定をオフにする必要があるかも。

https://github.com/nginx-proxy/nginx-proxy
