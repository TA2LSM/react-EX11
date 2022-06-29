import axios from 'axios';
import { toast } from 'react-toastify';

import logger from './logService';

// Metodun iki girdisi olan "success" ve "error" birer fonksiyon.
// Burada success ile işimiz yok o nedenle kullanılmadı.
// axios.interceptors.response.use(success, error);

// Metodun kendisi "middleware" galiba bu nedenle rejected promise
// geri dönerek kontrolü catch bloğuna veriyor.
// Aşağıdaki error fonksiyonu response olarak error aldığımız her seferde
// tek bir yerden çalıştırılacaktır. Böylece her metot içine error handling
// yazmaya gerek kalmayacaktır. SADECE UNEXPECTED ERROR handling için kullanılıyor.
axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response && error.response.status >= 400 && error.response.status < 500;
  //console.log('Interceptor Called!');

  if (!expectedError) {
    // Aşağıdaki kısım unexpected error durumu. Burada log'lama yapılması lazım.

    // Normalde hatanın database gibi bir yere kaydedilmesi gerekiyor. Bunun için
    // sentry,io sitesinden hesap açtık. Oradan proje oluşturup o ayarlar ile
    // burada kullandık. console.log kısmı da iptal edilmiş oldu.
    //console.log('Error Log: ', error);

    // sentry.io sitesi için kullanılan erişim modülü ayrıca bir modül içine yazılıp
    // buraya eklendi.
    logger.log(error);

    //alert('Unexpected Error: Something failed on the server!'); //alert yerine toast.error yazıldı
    toast.error('Unexpected Error: Something failed on the server!'); //alert yerine toast.error yazıldı
    //toast metotları: info, success, error, warning, dark ya da ek metot olmadan kullanılabilir
  }

  // Eğer HTTP 400-499 arası hataları aldıysak sadece rejected promise döner
  // Kontrolü aşağıdaki metotlar içindeki "catch" bloğuna aktarır. Orada
  // HTTP 400, 404...vs ayrımı yapılıp ilgili işlemler yapılır.
  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
