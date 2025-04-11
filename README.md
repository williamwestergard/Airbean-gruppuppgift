# Airbean-gruppuppgift

## Om projektet

AirBean är ett företag som låter kunder beställa kaffe hem till dörren via drönare.
Vilken lyx! Om det nu bara fanns på riktigt.

Det här repot är resultatet av ett grupprojekt där vi skapade en backend-server
till ett fiktivt företag.

Vi har använt oss av:
- express.js
- node.js
- sqlite3


## Instruktioner till REST API.
Url:  https://airbean-backend-k7pq.onrender.com
(Ingen nyckel behövs)

### Routes:

- /api/user/  --- __Skapa användare__
  - /api/user/:userid   ---  __Hitta eller radera användare__
  -  /api/user/history/:userId --- __Se användarens orderhistorik__


- /api/products --- __Se alla produkter i databasen__
  - /api/products/:id --- __Hitta individuella produkter__


- /api/order --- __Skapa beställning__
  - /api/order/:orderId --- __Hitta beställning eller lägg till produkt i beställningen__
  - /api/order/:orderId/product/:productId --- __Ta bort produkt från beställningen__




### Websockets:
En del av vår gruppuppgift var att diskutera om hur vi skulle kunna ha använt websockets i projektet.
Främst tänker vi att vi skulle ha en chatt-funktion där kunden kan prata med en kundservice.
Kunden skulle kunna få hjälp att ta bort beställningar som kunden inser att hen har skrivit in fel uppgifter för.
Hen skulle också kunna få hjälp att spåra paket som inte har anlänt än.
