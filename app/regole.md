# regole

1. usa lo strumento più semplice disponibile
1. tenere i cotroller più semplici possibili

    2.1. dividere i controller per "responsabilità" delle informazioni da **visualizzare**

2. non usare mai $(element) ma usa le direttive

---

## 1. usa lo strumento più semplice disponibile

Se per fare una cosa puoi usare 2 strumenti, di cui uno è fichissimo e fa un sacco di cose e un'altro tante meno, la scelta è facile:

**Usa quello più semplice per raggiungere l'obbiettivo.**

Le funzionalità in più non importano, a meno che queste non siano d'aiuto per il test ed il debug.


## 2. tenere i cotroller più semplici possibili

Il controller rappresenta lo **"stato"** della vista ed il **collegamento** con la logica applicativa.

Lo stato della vista coincide con lo $scope.
La vista si mappa sullo $scope tramite *dirty check*: ogni $digest o $apply scatena il *dirty check_* dei valori dello $scope. Questa operazione è quella "magica".

Minimizzare lo stato della vista significa:

* facilitare il debug
* facilitare il test
* rendere l'applicazione più veloce

## 2.1 dividere i controller per "responsabilità" delle informazioni da *visualizzare*

Deriva dal punto precedente

## 3. non usare mai $(element) ma usa le direttive

Se senti il bisogno di usare jquery e simili per fare qualcosa con il dom... sbagli candeggio, devi usare le direttive.

