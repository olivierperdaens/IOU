# IOU
Projet Cours LSINF1212 - Application web

## Procédure pour lancer l'application

### Configuration
> MongoDB v3.0.0 ou + 


### Run database:
1) Install MongoDB server
2) Import each '.json' file from database_backup folder with ``mongoimport``
3) Database name: iou
4) Run your database with
```mongod --dbpath <path_to_your_database_directory>```


### Run web server:
```npm start```

## Lancement des Tests unitaires
``npm test``
