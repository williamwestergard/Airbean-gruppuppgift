# Airbean-gruppuppgift

## Om projektet

AirBean är ett företag som låter kunder beställa kaffe hem till dörren via drönare.
Vilken lyx! Om det nu bara fanns på riktigt...

Det här repot är resultatet av ett grupprojekt där vi skapade en backend-server
till ett fiktivt företag.

Vi har använt oss av:
- express.js
- node.js
- sqlite3


## Instruktioner till REST API.
Url:  https://airbean-backend-k7pq.onrender.com

### Routes:

- /api/user/ // Skapa användare
  - /api/user/:userid  // Hitta eller radera användare
  -  /api/user/history/:userId // Se användarens orderhistorik

- /api/products // Se alla produkter i databasen
  - /api/products/:id // Hitta individuella produkter

- /api/order // Skapa beställning
  - /api/order/:orderId // Hitta beställning eller lägg till produkt i beställningen
  - /api/order/:orderId/product/:productId // Ta bort produkt från beställningen

