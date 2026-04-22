# Rövid dokumentáció a beüzemeléshez
3.1 Részletes beüzemelési útmutató
A rendszer két külön részből áll:
•	Backend (Laravel) → ez kezeli az adatokat és az adatbázist
•	Frontend (Angular) → ez az, amit a felhasználó lát a böngészőben
1. Szükséges programok telepítése:
•	PHP (legalább 8.2)** → a Laravel futtatásához
•	Composer → a PHP csomagok kezelésére
•	Node.js és NPM → az Angular futtatásához
•	XAMPP(MySql) → adatbázis
•	Angular CLI → Angular projektek indításához

2. A projekt letöltése
A projekt két külön Github repository-ból áll (frontend és backend).
Egy tetszőleges névvel létrehozott mappa parancssor (cmd) felületén kiadjuk az alábbi két parancsot a frontend és a backend klónozásához:
•	git clone https://github.com/HelpConnectProject/Backend.git
•	git clone https://github.com/HelpConnectProject/Frontend.git
A mappaszerkezet ezután:
HelpConnect/
	Backend/
	Frontend/
3. Backend beüzemelése
3.1 Belépés a backend mappába →cd Backend
3.2 Csomagok telepítése (ez letölti az összes szükséges Laravel fájlt) →composer install
3.3 Környezeti fájl létrehozása: A Laravel egy `.env` fájlt használ a beállításokhoz.
	A következő parancs segítségével a Githubra is biztonságosan feltölthető .env.example
	állomány tartalmáról készítünk egy másolatot a .env (környezeti fájl) létrehozásához. 
	→cp .env.example .env
	3.4 Alkalmazás kulcs generálása →php artisan key:generate
	3.5 Adatbázis beállítása
	Nyisd meg a `.env` fájlt egy tetszőleges szövegszerkesztővel, vagy IDE-vel, és keresd meg ezt a 
	részt:
DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=
	Majd cseréld ki erre (ajánlott adatbázis beállítások):
		DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=helpconnect
DB_USERNAME=root
DB_PASSWORD=
	
	Amennyiben email küldés szolgáltatásra is szükséged van(ez egy elengedhetetlen eleme a 
	regisztrációnak és a jelszó visszaállításnak!) szükséges valamilyen mailer szolgáltatás
	beállítása. Mi most a Gmail használatát vesszük alapul. 
Először is be kell lépni a saját Gmail fiókba, majd meg kell nyitni a Google fiók beállításait. Ott a „Biztonság” (Security) menüpont alatt található a kétlépcsős azonosítás (2-Step Verification). Ez kötelező feltétel, tehát ha még nincs bekapcsolva, akkor először ezt kell aktiválni. A Google végigvezet a folyamaton, általában telefonszámmal vagy egy hitelesítő alkalmazással kell megerősíteni a belépést.
Ha a kétlépcsős azonosítás már aktív, akkor ugyanebben a Biztonság menüben meg fog jelenni egy új opció „Alkalmazásjelszavak” (App Passwords) néven. Erre rákattintva létre lehet hozni egy új jelszót. A rendszer meg fog kérdezni két dolgot: hogy milyen alkalmazáshoz és milyen eszközhöz készül a jelszó. Itt igazából bármit lehet választani, például „Mail” és „Other (Custom name)”, majd adhattok neki egy nevet, például „Laravel”. Ezután a Google generál egy 16 karakteres jelszót.
Ezt a jelszót nagyon fontos elmenteni, mert később nem lehet újra megjeleníteni. Nem a saját Gmail jelszavat kell használni, hanem kizárólag ezt az alkalmazásjelszót.
Ezután keressük meg a .env állományban ez a részt:



MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
	És cseréljük ki erre:
MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=sajatgmai@gmail.com
MAIL_PASSWORD=app jelszó, space karakterek eltávolításával! pl. (aaaabbbbccccdddd)
MAIL_FROM_ADDRESS=" sajatgmai@gmail.com”
MAIL_FROM_NAME="${APP_NAME}"


3.6 Adatbázis táblák létrehozása (migration)
Ez hozza létre a szükséges táblákat →php artisan migrate
	3.7 Alap adatok feltöltése (seeder)
	Ez feltölti az adatbázist kezdő adatokkal→php artisan db:seed
3.8 XAMPP alkalmazás(vagy más lokális szervercsomag) megnyitása, majd 
MySql szerver elindítása
3.9 Backend szerver indítása→php artisan serve
Ezután a backend itt fut: http://127.0.0.1:8000
3.10 Kilépünk a backend mappából

4. Frontend beüzemelése (Angular)
4.1 Belépés a frontend mappába →cd Frontend
4.2 Függőségek telepítése →npm install
4.3 Frontend indítása →ng serve -o
	innen lesz a weboldal: http://localhost:4200
