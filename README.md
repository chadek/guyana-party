# guyana-party

Site d'évènement en Guyane

Prérequis:
  * Installer node js
  * Installer le Node Packaged Module (npm)
  * Télécharger toute les dépendances à l'aide de npm (lancer npm install à l'emplacement du fichier package.json)
  * Installer MongoDB et démarrer le service (sudo service mongod start)
  
  Pour démarrer l'application en mode développement exécuter l'instruction suivante à partir du dossier principal: DEBUG=guyana-party:* npm start
  
  L'application est accessible à partir du port 3000 (http://localhost:3000)
  MongoDB est accessible à partir du port 27017
  Pour visualiser le contenu de la base de données, démarrer mongo et entrer les lignes de commandes voulus. Quelques commandes utiles : 
  * use mybdName
  * db.createCollection("collectionName")
  * db.user.insert({ fieldName: 'someValue', otherFieldName: 13566 })
  * db.user.find().pretty()

English version:

Website for events in Guyana

Prerequistes:
 * NodeJS
 * npm
 * mongodb

Usage:
 * npm install
 * launch mongodb
 * DEBUG=guyana-party:* npm start
 * go to 127.0.0.1:3000
