//const express = require('express')
import express from 'express'
import mysql from 'mysql'
import cors from 'cors'

const PORT = 3001;
const app = express();
app.use(cors());
app.use(express.json());

// Configuration CORS doit être avant les routes
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "piasoft-test"
})

//get route
// Route pour obtenir le nombre total de vendeurs
app.get('/Vendeurs/disponibles', (req, res) => {
    const sql = "SELECT COUNT(*) as total_vendeurs FROM vendeur";
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ 
                success: false,
                message: "Erreur lors de la récupération des vendeurs",
                error: err.message
            });
        }
        
        // Vérifie si des résultats sont retournés
        if (results && results.length > 0) {
            return res.json({ 
                success: true,
                total_vendeurs: results[0].total_vendeurs
            });
        } else {
            return res.json({
                success: true,
                total_vendeurs: 0
            });
        }
    });
});

app.get('/vendeur', (req, res) => {
    const sql = "SELECT * FROM vendeur";
    db.query(sql, (err, results) => { 
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ 
                success: false,
                message: "Erreur lors de la récupération des animaux",
                error: err.message
            });
        }
        
        return res.json({ 
            success: true,
            animaux: results  // Renvoie le tableau complet des résultats
        });
    });
});

// Route pour obtenir le nombre d'animaux disponibles
app.get('/animaux/disponibles', (req, res) => {
    const sql = "SELECT COUNT(*) as nombre_animaux_disponibles FROM animal WHERE etat = 'disponible'";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ erreur: "Erreur lors de la récupération des données" });
        return res.json({ 
            success: true,
            nombre_animaux_disponibles: result[0].nombre_animaux_disponibles 
        });
    });
});

// Route pour obtenir la liste complète des animaux disponibles
app.get('/animaux', (req, res) => {
    const sql = "SELECT * FROM animal WHERE etat = 'disponible'";
    db.query(sql, (err, results) => { 
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ 
                success: false,
                message: "Erreur lors de la récupération des animaux",
                error: err.message
            });
        }
        
        return res.json({ 
            success: true,
            animaux: results  // Renvoie le tableau complet des résultats
        });
    });
});

// Route pour obtenir la liste complète des animaux vedu
app.get('/animaux/vendu/pourcentage', (req, res) => {
    const sql = "SELECT * FROM animal WHERE etat = 'vendu'";
    db.query(sql, (err, results) => { 
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ 
                success: false,
                message: "Erreur lors de la récupération des animaux",
                error: err.message
            });
        }
        
        return res.json({ 
            success: true,
            animaux: results  // Renvoie le tableau complet des résultats
        });
    });
});

// Route pour obtenir le nombre d'Animaux Vendus
app.get('/animaux/vendu', (req, res) => {
    const sql = "SELECT COUNT(*) as nombre_animaux_disponibles FROM animal WHERE etat = 'vendu'";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ erreur: "Erreur lors de la récupération des données" });
        return res.json({ 
            success: true,
            nombre_animaux_disponibles: result[0].nombre_animaux_disponibles 
        });
    });
});


// Route pour obtenir le montant total des ventes
app.get('/vente/total', (req, res) => {
    const sql = "SELECT COALESCE(SUM(prix_vente), 0) AS total_ventes FROM detail_vente";
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ 
                success: false,
                message: "Erreur lors de la récupération du total des ventes",
                error: err.message
            });
        }
        
        // COALESCE retourne 0 si le résultat est NULL
        const totalVentes = results[0]?.total_ventes || 0;
        
        return res.json({ 
            success: true,
            total_ventes: parseFloat(totalVentes) // Conversion en nombre
        });
    });
});

//nouvelles_vente get
app.get('/nouvelles_vente/liste', (req, res) => {
    const sql = "SELECT v.code_vente, c.nom_categorie, v.quantite, v.prix_unitaire, (v.quantite * v.prix_unitaire) AS montant_total, v.date_vente, ve.nom AS nom_vendeur,ve.prenom AS prenom_vendeur FROM newvente v JOIN categorie c ON v.id_categorie = c.id_categorie JOIN vendeur ve ON v.id_vendeur = ve.id_vendeur ORDER BY v.date_vente DESC;";
    db.query(sql, (err, results) => { 
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ 
                success: false,
                message: "Erreur lors de la récupération des animaux",
                error: err.message
            });
        }
        
        return res.json({ 
            success: true,
            animaux: results  // Renvoie le tableau complet des résultats
        });
    });
});

// Route pour les totaux de ventes avec filtres
app.get('/ventes/totaux', (req, res) => {
    const { periode } = req.query;
    let whereClause = "";
    const params = [];

    const now = new Date();

    // Début de la semaine (lundi)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    startOfWeek.setHours(0, 0, 0, 0);

    // Début du mois
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    if (periode === 'semaine') {
        whereClause = "WHERE v.date_vente >= ?";
        params.push(startOfWeek);
    } else if (periode === 'mois') {
        whereClause = "WHERE v.date_vente >= ?";
        params.push(startOfMonth);
    }

    const sql = `
        SELECT 
            c.nom_categorie AS nom_categorie,
            COUNT(v.code_vente) AS total_ventes,
            COALESCE(SUM(v.quantite), 0) AS total_quantite,
            COALESCE(SUM(v.quantite * v.prix_unitaire), 0) AS total_montant,
            COUNT(DISTINCT v.id_vendeur) AS nombre_vendeurs
        FROM newvente v
        JOIN categorie c ON v.id_categorie = c.id_categorie
        ${whereClause}
        GROUP BY c.id_categorie, c.nom_categorie
        ORDER BY total_quantite DESC
    `;

    console.log('Requête SQL:', sql, 'Paramètres:', params);

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({
                success: false,
                message: "Erreur serveur lors de la récupération des totaux",
                error: err.message
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
});



//POST route

/*app.post('vendeur', (req, res) => {
    const sql = "INSERT INTO vendeur (nom, prenom, telephone) VALUES (?)";
        const values = [
        req.body.nom,
        req.body.prenom,
        req.body.telephone
    ]
    db.query(sql, [values], (err, result) => {
        if(err) return res.json(err);
        return res.json(result);
    })
})    
*/

//Nouvelle vente
app.post('/insert/vente', (req, res) => {
    const sql = "INSERT INTO newvente (id_categorie,quantite,prix_unitaire,date_vente,id_vendeur) VALUES (?)";
        const values = [
        req.body.id_categorie,
        req.body.quantite,
        req.body.prix_unitaire,
        req.body.date_vente,
        req.body.id_vendeur
    ]
    db.query(sql, [values], (err, result) => {
        if(err) return res.json(err);
        return res.json(result);
    })
})

// Route pour ajouter un nouvel animal
app.post('/api/animaux', (req, res) => {
    const { code_animal, id_categorie, etat = 'disponible' } = req.body;
    
    // Validation des données
    if (!code_animal || !id_categorie) {
        return res.status(400).json({
            success: false,
            message: "Le code animal et la catégorie sont requis"
        });
    }

    const sql = "INSERT INTO animal (code_animal, id_categorie, etat, date_enregistrement) VALUES (?, ?, ?, NOW())";
    
    db.query(sql, [code_animal, id_categorie, etat], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de l\'animal:', err);
            return res.status(500).json({
                success: false,
                message: "Erreur lors de l'ajout de l'animal",
                error: err.message
            });
        }
        
        res.json({
            success: true,
            message: "Animal ajouté avec succès",
            id: result.insertId
        });
    });
});

// Route pour obtenir le résumé des animaux
app.get('/api/cheptel/resume', (req, res) => {
    const sql = `
        SELECT 
            c.nom_categorie as categorie,
            COUNT(a.id_animal) as total,
            SUM(CASE WHEN a.etat = 'disponible' THEN 1 ELSE 0 END) as disponible,
            SUM(CASE WHEN a.etat = 'vendu' THEN 1 ELSE 0 END) as vendu
        FROM animal a
        JOIN categorie c ON a.id_categorie = c.id_categorie
        GROUP BY c.id_categorie, c.nom_categorie
        ORDER BY c.nom_categorie
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération du résumé du cheptel:', err);
            return res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: err.message
            });
        }
        
        res.json({
            success: true,
            data: results
        });
    });
});


//DELETE ROUTE
app.delete('/vente/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM newvente WHERE code_vente = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression de la vente:', err);
            return res.status(500).json({ 
                success: false,
                message: "Erreur lors de la suppression de la vente",
                error: err.message
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                message: "Vente non trouvée"
            });
        }
        
        return res.json({ 
            success: true,
            message: "Vente supprimée avec succès"
        });
    });
});



app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});