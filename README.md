# Installation du Backend PHP sur Apache

## Prérequis

- Serveur Apache 2.4 ou supérieur
- PHP 8.0 ou supérieur
- MySQL
- Module `mod_rewrite` d'Apache activé
- Extensions PHP requises : `pdo_mysql`, `json`, `mbstring`, `openssl`

## Installation

1. **Configuration du serveur web**

   - Assurez-vous que le module `mod_rewrite` est activé :
     ```bash
     sudo a2enmod rewrite
     sudo systemctl restart apache2
     ```

2. **Configuration du Virtual Host**

   Créez un fichier de configuration pour votre site dans `/etc/apache2/sites-available/` (par exemple `votresite.conf`) :

   ```apache
   <VirtualHost *:80>
       ServerName votredomaine.com
       ServerAdmin webmaster@votredomaine.com
       DocumentRoot /var/www/votresite/public

       <Directory /var/www/votresite/public>
           Options -Indexes +FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>

       ErrorLog ${APACHE_LOG_DIR}/votresite_error.log
       CustomLog ${APACHE_LOG_DIR}/votresite_access.log combined
   </VirtualHost>
