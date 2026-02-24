export const environment = {
	host: 'http://localhost:8000/api/',
    // ha telefonon is meg akarod nézni:
    // akkor:
    //host: 'http://192.168.8.108:8000/api/',
    // az enyém:
    // host: 'http://192.168.0.136:8000/api/',
    // a localhostos ip t kicommenteled, ami pedig most van kommentbe azt hagyod
    // bent a saját ip-vel.
    // laravelben:
    // php artisan serve --host 0.0.0.0
    // itt angularban:
    // ng serve --host 0.0.0.0
	
} as const;

