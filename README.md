# IOU
Projet Cours LSINF1212 - Application web

## Procédure pour lancer l'application

### Configuration
> MongoDB v3.0.0 ou + 


### Run database:
1) Install MongoDB server
2) Import each '.json' file from database_backup folder with ``mongoimport -d iou -c <collection> --file <each_file_from_/database_backups/>``. Each 'json' file represent a collection in the database
3) Database name: iou
4) Run your database with
```mongod --dbpath <path_to_your_database_directory>```


### Run web server:
```npm start```

## Lancement des Tests unitaires
``npm test``


### Info login test
Login 1: "olivier.perdaens@hotmail.fr" \
Password 1: "test" \
\
Login 2: "jean.dubois@gmail.com" \
Password 2: "test" \
\
Login 3: "oliper.oliper@hotmail.be" \
Password 3: "test"  

