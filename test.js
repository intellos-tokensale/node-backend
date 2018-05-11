import service from './lib/transaction';

console.log(service);
service.updateForBTCAddress('1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v', 1)
    .then((data) => {
        console.log(data);
    });